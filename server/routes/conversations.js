import { Conversation } from "#FifengerModels";
import { Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Attachments, JSON_SERVER_ERROR, Jsoner, Middlewares, Validators } from "#FifengerServer";

const conversations = Router();

const validator = Validators.conversation;

conversations.post("/group", Middlewares.authUser, async (req, res) => {
    const { conversationId } = req.body;
    const invalid_group_members = {
        errors: ["El grupo base es invalido."]
    };

    if(!isValidObjectId(conversationId)) {
        return res.status(400).json(invalid_group_members);
    }

    const body = validator.parseBody(req.body);

    const errors = validator.validate(body);
    if(errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    const empties = validator.empties(body, "name");
    if(empties.length > 0) {
        res.status(400).json({ errors: empties });
        return;
    }

    const { name } = body;

    try {
        const base = await Conversation.findById(conversationId);

        if(!base) {
            res.status(400).json(invalid_group_members);
            return;
        }

        const conversation = await Conversation.create({
            name: name,
            isGroup: true,
            participants: base.participants
        });

        const conversationR = await Conversation
            .findById(conversation._id)
            .populate("participants");

        return Jsoner.conversation(conversationR);
    }
    catch(_) {
        res.status(500).json(JSON_SERVER_ERROR);
    }
});

conversations.get("/", Middlewares.authUser, async (req, res) => {
    const query = req.query;

    if(!query) return res.status(400).send("User not found");

    const userId = query.userId + "";

    if(!isValidObjectId(userId)) return res.status(400).json({
        message: "Invalid user ID."
    });
    
    const conversations = await Conversation.find({
        participants: {
            $in: [new Types.ObjectId(userId)]
        }
    }).populate("participants");
    
    res.send(conversations);
});

conversations.get("/:id", Middlewares.authUser, async (req, res) => {
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