import { Conversation, Message, User } from "#FifengerModels";
import { Router } from "express";
import { Server } from "socket.io";
import { Attachments, JSON_SERVER_ERROR, Jsoner, Middlewares, Validators } from "#FifengerServer";
import nodemailer from "nodemailer";
const messages = Router();
const validator = Validators.messages;

const transporter = nodemailer.createTransport({
    host: process.env["SMTP_HOST"],
    port: Number(process.env["SMTP_PORT"]),
    service: "gmail",
    auth: {
        user: process.env["SMTP_USER"],
        pass: process.env["SMTP_PASS"]
    }
});

messages.get("/:conversationId", Middlewares.authUser, async (req, res) => {
    const { conversationId } = req.params;
    try {
        const messages = await Message.find({
            conversationId
        }).populate("user");
        const data = messages.map(Jsoner.message);
        res.status(200).json(data);
    }
    catch(_) {
        res.status(500).json(JSON_SERVER_ERROR);
    }
});

messages.post("/send-email", Middlewares.authUser, async (req, res) => {
    const { conversationId, content } = req.body;
    const { id } = req.user;
    const senderId = id;

    console.log("Entrando al try");
    try {

        const conversation = await Conversation.findById(conversationId)
            .populate("participants");

        if (!conversation) {
            return res.status(404).json({
                error: "Conversation not found."
            });
        }

        const receiver = conversation.participants.find(
            user => user._id.toString() !== senderId
        );

        if (!receiver || !receiver.email) {
            return res.status(404).json({
                error: "Recipient user does not have email."
            });
        }

        const mailOptions = {
            from: '"Fifenger App" <no-reply@fifenger.com>',
            to: receiver.email,
            subject: 'You have a new external message from Fifenger', 
            text: content,
            html: `<p>A system user has sent you the following message:</p>
                   <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">`
                     + content +
                   `</blockquote>
                   <p>Log in to the platform to respond.</p>`
        };

        transporter.verify((error) => {
            if(error){
                console.log(error);
            }
            else{
                console.log("Conecto!");
            }
        });

        await transporter.verify();

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: "Email sent correctly." });

    } catch (error) {
        console.error("Error en SMTP:", error);
        return res.status(500).json({ error: "There was an error processing the SMTP submission." });
    }
});

messages.post("/", Middlewares.authUser,
    Attachments.single("attachment"),
    async (req, res) => {
        const file = req.file;

        /**@type {Server} */
        const io = req.app.get("io");
        if(!io) {
            res.status(500).json(JSON_SERVER_ERROR);
            return;
        }

        const body = validator.parseBody(req.body);
        const contentEmpty = validator.getEmptyMessage(body, "content");

        if(!contentEmpty && !file) {
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

        const { content, conversationId, destinatorId, senderId } = body;

        if ((conversationId && destinatorId)) {
            return res.status(400).send("Invalid payload combination");
        }

        try {
            let conversation = null;
            const sender = await User.findById(senderId);
            if(!sender) return res.status(400).send("User Sender not found with senderId");

            if(conversationId) {
                conversation = await Conversation.findById(conversationId);
            }
            else {
                const participants = [senderId, destinatorId];

                conversation = await Conversation.findOneAndUpdate({
                    participants: {
                        $all: participants,
                        $size: 2
                    }
                },
                {
                    $setOnInsert: {
                        participants: participants
                    }
                },
                {
                    upsert: true,
                    returnDocument: "after"
                });
            }

            if (!conversation) return res.status(400).send("Conversation not found");

            let attachmentUrl = undefined; 

            if(file) {
                attachmentUrl = await Attachments.save(file);
            }

            const message = await Message.create({
                content: content,
                user: senderId,
                attachmentUrl: attachmentUrl,
                isEncrypted: false,
                conversationId: conversation._id
            });

            await message.populate("user");

            const msgJson = Jsoner.message(message);

            io.to(conversation._id.toString()).emit("message_create", msgJson);

            res.status(200).json(msgJson);
        }
        catch(_) {
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

export default messages;
