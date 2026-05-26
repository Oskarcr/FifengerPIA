import { Conversation, Message, User } from "#FifengerModels";
import { Router } from "express";
import { Server } from "socket.io";
import { Attachments, FifengerCrypto, JSON_NOT_FOUND, JSON_SERVER_ERROR, Jsoner, Middlewares, Validators } from "#FifengerServer";
import nodemailer from "nodemailer";
import { isValidObjectId } from "mongoose";

const messages = Router();
const validator = Validators.messages;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env["SMTP_USER"],
        pass: process.env["SMTP_PASS"]
    }
});

const POINTS_COOLDOWN = 20 * 1000;

/**
 * Intenta dar los puntos correspondientes al jugador
 * por mensaje enviado mediante el entorno.
 * @param {string} userId  
 */
async function autoGivePoints(userId, {
    isGroup = false,
    content = undefined,
    attachmentUrl = undefined
}) {
    let points = 0;
    
    // Por cada caracter te dan 2 puntos max 140.
    if(content) points += Math.min(140, 2 * content.length);

    // Por una imagen te dan 90 puntos.
    if(attachmentUrl) points += 100;

    // Si es un grupo te dan +30% del total. 
    if(isGroup) points *= 1.3;

    points = Math.round(points);
    if(points <= 0) return;

    try {
        const limitDate = new Date(Date.now() - POINTS_COOLDOWN);
        await User.findOneAndUpdate({
            _id: userId,
            $or: [
                { lastPointsAt: { $lte: limitDate } },
                { lastPointsAt: { $exists: false } }
            ]
        },
        {
            $inc: { points: points },
            $set: { lastPointsAt: new Date() }
        },
        { 
            returnDocument: "after"
        });
    }
    catch {} 
}

messages.get("/:conversationId", 
    Middlewares.authUser, 
    async (req, res) => {
        const { conversationId } = req.params;

        if(!isValidObjectId(conversationId)) {
            res.status(404).json(JSON_NOT_FOUND);
            return;
        }

        try {
            const conversation = await Conversation.findById(conversationId);
            if(!conversation) {
                res.status(404).json(JSON_NOT_FOUND);
                return;
            }

            const messages = await Message.find({
                conversationId
            }).populate("user");

            if(!conversation.felk) {
                conversation.felk = FifengerCrypto.felk();
                await conversation.save();
            }

            const FELK = conversation.felk;

            const data = messages.map((message) => {
                if(message.isEncrypted) {
                    const content = FifengerCrypto.decrypt(message.content, conversationId, FELK);
                    const msgJson = Jsoner.message(message);
                    msgJson.content = content;
                    return msgJson;
                    
                }
                return Jsoner.message(message);
            });
            res.status(200).json(data);
        }
        catch(_) {
            console.log(_);
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

messages.post("/send-email", Middlewares.authUser, async (req, res) => {
    const { conversationId, content } = req.body;
    const senderId = req.user.id;

    try {

        const conversation = await Conversation.findById(conversationId)
            .populate("participants");

        if (!conversation) {
            return res.status(404).json({
                error: "Conversation not found."
            });
        }

        if (conversation.isGroup) {
            return res.status(400).json({
                error: "Email notifications are not supported for group chats yet."
            });
        }

        const receiver = conversation.participants.find(
            user => {const participantId = user.id.toString() || user._id.toString();
            return participantId !== senderId
        });

        console.log("INTENTANDO ENVIAR CORREO A:", receiver ? receiver.email : "Nadie encontrado");

        if (!receiver || !receiver.email) {
            return res.status(404).json({
                error: "Recipient user does not have email."
            });
        }

        const mailOptions = {
            from: "Fifenger App " + "<" + process.env["SMTP_USER"] + ">",
            to: receiver.email,
            subject: 'You have a new external message from Fifenger', 
            text: content,
            html: `<p>A system user has sent you the following message:</p>
                   <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">`
                     + content +
                   `</blockquote>
                   <p>Log in to the platform to respond.</p>`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent correctly." });

    } catch (error) {
        console.error("Error en SMTP:", error);
        return res.status(500).json({ error: "There was an error processing the SMTP submission." });
    }
});

messages.post("/", 
    Middlewares.authUser,
    Attachments.single("attachment"),
    async (req, res) => {
        // @ts-ignore
        const userId = req.user.id + "";
        const file = req.file;

        /**@type {Server} */
        const io = req.app.get("io");
        if(!io) {
            res.status(500).json(JSON_SERVER_ERROR);
            return;
        }

        const body = validator.parseBody(req.body);

        const contentEmpty = validator.getEmptyMessage(body, "content");

        if(contentEmpty && !file) {
            res.status(400).json({ 
                errors: ["El mensaje esta completamente vacio."] 
            });
            return;
        }

        const errors = validator.validate(body);

        if(errors.length > 0) {
            res.status(400).json({ errors });
            return;
        }

        const { content, conversationId, destinatorId } = body;

        if ((conversationId && destinatorId)) {
            return res.status(400).send("Invalid payload combination");
        }

        try {
            let conversation = null;
            const sender = await User.findById(userId);
            if(!sender) return res.status(400).send("User Sender not found with senderId");

            if(conversationId) {
                conversation = await Conversation.findById(conversationId);
            }
            else {
                const participants = [userId, destinatorId];

                conversation = await Conversation.findOne({
                    participants: {
                        $all: participants,
                        $size: 2
                    }
                });

                if(!conversation) {
                    conversation = await Conversation.create({
                        participants
                    });
                }
            }

            if (!conversation) {
                res.status(404).json(JSON_NOT_FOUND);
                return;
            }

            if(!conversation.felk) {
                conversation.felk = FifengerCrypto.felk();
                await conversation.save();
            }

            let attachmentUrl = undefined; 

            if(file) {
                attachmentUrl = await Attachments.save(file);
            }

            const message = await Message.create({
                content: 
                    (!conversation.encryptionEnabled) ? content : 
                    FifengerCrypto.encrypt(content, conversationId, conversation.felk),
                user: userId,
                attachmentUrl: attachmentUrl,
                isEncrypted: conversation.encryptionEnabled,
                conversationId: conversation._id
            });

            await message.populate("user");

            const msgJson = Jsoner.message(message);
            msgJson.conversationId = conversation._id;

            console.log(msgJson);
            msgJson.content = content;

            io.to(conversationId).emit("message_create", msgJson);

            autoGivePoints(userId, {
                ...msgJson,
                isGroup: conversation.isGroup
            });

            res.status(200).json(msgJson);
        }
        catch(_) {
            console.log(_);
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

export default messages;
