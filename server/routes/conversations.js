import { Conversation } from "#FifengerModels";
import { Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Attachments, JSON_NOT_FOUND, JSON_SERVER_ERROR, Jsoner, Middlewares, Validators } from "#FifengerServer";

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

        await conversation.populate("participants");

        res.status(200).json(Jsoner.conversation(conversation));
    }
    catch(_) {
        res.status(500).json(JSON_SERVER_ERROR);
    }
});

conversations.patch("/:id/switch_encryption", 
    Middlewares.authUser,
    Middlewares.requireId,
    async (req, res) => {
        // @ts-ignore
        const userId = req.user.id + "";
        const id = req.params.id + "";

        try {
            const conversation = await Conversation.findById(id);
            if(!conversation) {
                res.status(404).json(JSON_NOT_FOUND);
                return;
            }
            const participants = conversation.participants;
            const belongs = participants.some(id => id.equals(userId));
            if(!belongs) {
                res.status(401).json({
                    errors: ["You don't belong in this conversation."]
                });
                return;
            }

            const currentEncryptionEnabled = conversation.get("encryptionEnabled");
            conversation.set({
                encryptionEnabled: !currentEncryptionEnabled
            });
            await conversation.save();

            res.status(200).json(Jsoner.conversation(conversation));
        }
        catch(_) {
            res.status(200).json(JSON_SERVER_ERROR);
            return;
        }
    }
);

conversations.get("/", 
    Middlewares.authUser, 
    async (req, res) => {
        const query = req.query;

        if(!query) return res.status(400).send("User not found");

        const userId = query.userId + "";

        if(!isValidObjectId(userId)) return res.status(400).json({
            message: "Invalid user ID."
        });
        try {
            const conversations = await Conversation.find({
                participants: {
                    $in: [new Types.ObjectId(userId)]
                }
            }).populate("participants");
            
            const data = conversations.map(Jsoner.conversation);
            res.status(200).json(data);
        }
        catch(_) {
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

conversations.get("/:id", 
    Middlewares.authUser, 
    async (req, res) => {
        // @ts-ignore
        const userId = req.user.id + "";
        const { id } = req.params;

        if(!isValidObjectId(id)) {
            res.status(404).send(JSON_NOT_FOUND);
            return;
        }

        const conversation = await Conversation.findById(id)
        .populate("participants");

        if (!conversation) {
            res.status(404).json(JSON_NOT_FOUND);
            return;
        }

        const participants = conversation.participants;
        const belongs = participants.some(id => id.equals(userId));
        if(!belongs) {
            res.status(401).json({
                errors: ["You don't belong in this conversation."]
            });
            return;
        }

        res.status(200).json(Jsoner.conversation(conversation));
    }
);

export default conversations;