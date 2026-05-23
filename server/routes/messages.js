import { Conversation, Message, User } from "#FifengerModels";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { Server } from "socket.io";
import Validators from "../validations/main.js";
const messages = Router();
const validator = Validators.messages;

messages.get("/:conversationId",async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Message.find({
        conversationId
    }).populate("user", "username email").sort({ createdAt: -1 });
    res.send(messages);
});

messages.post("/", async (req, res) => {
    /**@type {Server} */
    const io = req.app.get("io");
    if(!io) return res.status(500).send("Server error, try again later...");

    const body = validator.parseBody(req.body);

    const empties = validator.empties(body, "content");

    if(empties.length > 0) {
        res.status(400).json({
            empties
        });
        return;
    }

    const errors = validator.validate(body);

    if(errors.length > 0) {
        res.status(400).json({
            errors
        });
        return;
    }

    const { content, conversationId, destinatorId, senderId } = body;
    //const { senderId, content, conversationId, destinatorId } = req.body;

    if ((conversationId && destinatorId)) {
        return res.status(400).send("Invalid payload combination");
    }

    let conversation = null;
    const sender = await User.findById(senderId);
    if(!sender) return res.status(400).send("User Sender not found with senderId");

    if(conversationId) {
        conversation = await Conversation.findById(conversationId);
    }
    else {
        const participants = [senderId, destinatorId];

        conversation = await Conversation.findOne({
            participants: {
                $all: participants,
                $size: 2
            }
        });

        // Si no existe la conversacion entre los individuos, crearla.

        if(!conversation) {
            const destinator = await User.findById(destinatorId);
            if(!destinator) return res.status(400).send("User Destinator not found with destinatorId");
            conversation = await Conversation.create({
                participants: participants
            });
        }
    }

    if (!conversation) return res.status(400).send("Conversation not found");

    const message = await Message.create({
        content: content,
        user: senderId,
        isEncrypted: false,
        conversationId: conversation._id
    });

    const objMessage = message.toObject();
    objMessage.user = sender.toObject();
    delete objMessage.user.password;

    io.to(conversation._id.toString()).emit("message_create", {
        username: sender.get("username"),
        content: content,
        conversationId: conversationId,
        createdAt: Date.now()
    });

    res.status(200).send(objMessage);
});

export default messages;
