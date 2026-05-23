import { Conversation } from "#FifengerModels";
import { Router } from "express";
import Validators from "../validations/main.js";
import { isValidObjectId } from "mongoose";
const conversations = Router();
const validator = Validators.conversations;

conversations.get("/", async (req, res) => {
    const query = req.query;

    if(!query) return res.status(400).send("User not found");

    const userId = query.userId;

    if(!isValidObjectId(userId)) return res.status(400).json({
        message: "Invalid user ID."
    });
    
    const conversations = await Conversation.find({
        participants: {
            $in: [userId] // $in es que se encuentre en la lista
        }
    }).populate("participants", "username");
    
    res.send(conversations);
});

conversations.get("/:id", async (req, res) => {
    const { id } = req.params;

    const conversation = await Conversation.findById(id)
    .populate("participants", "username");

    if (!conversation) {
        return res.status(404).send("Conversation not found");
    }

    /*if (!conversation.participants.some(p => p.toString() === userId)) {
        return res.status(403).send("Unauthorized action");
    }*/

    res.json(conversation);
});

export default conversations;