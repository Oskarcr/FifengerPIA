import { Models } from "#FifengerServer";
import { Router } from "express";
const messages = Router();

messages.get("/:conversationId",async (req, res) => {
    const { conversationId } = req.params;
    const messages = await Models.Message.find({
        conversationId
    }).populate("user", "username email").sort({ createdAt: -1 });
    res.send(messages);
});

messages.post("/", async (req, res) => {
    const { senderId, content, conversationId, destinatorId } = req.body;

    if(typeof content !== "string") return res.status(400).send("Content must be 'string'");

    if(!Models.isObjectId(senderId)) return res.status(400).send("SenderId is not id");

    if ((conversationId && destinatorId)) {
        return res.status(400).send("Invalid payload combination");
    }

    let conversation = null;
    const sender = await Models.User.findById(senderId);
    if(!sender) return res.status(400).send("User Sender not found with senderId");

    if(conversationId) {
        if(!Models.isObjectId(conversationId)) return res.status(400).send("ConversationId is not id");
        conversation = await Models.Conversation.findById(conversationId);
    }
    else {
        if(!Models.isObjectId(destinatorId)) return res.status(400).send("DestinatorId is not id");

        const participants = [senderId, destinatorId];

        conversation = await Models.Conversation.findOne({
            participants: {
                $all: participants,
                $size: 2
            }
        });

        // Si no existe la conversacion entre los individuos, crearla.

        if(!conversation) {
            const destinator = await Models.User.findById(destinatorId);
            if(!destinator) return res.status(400).send("User Destinator not found with destinatorId");
            conversation = await Models.Conversation.create({
                participants: participants
            });
        }
    }

    if (!conversation) return res.status(400).send("Conversation not found");

    const message = await Models.Message.create({
        content: content,
        user: senderId,
        isEncrypted: false,
        conversationId: conversation._id
    });

    const objMessage = message.toObject();
    objMessage.user = sender.toObject();
    delete objMessage.user.password;

    //res.status(200).send(objMessage);
});

export default messages;
