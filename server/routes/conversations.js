import { Conversation, User } from "#FifengerModels";
import { Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import { JSON_SERVER_ERROR, Jsoner, Middlewares, Validators } from "#FifengerServer";

const conversations = Router();

const validator = Validators.conversation;

// Crea un nuevo grupo mediante el email del usuario y el nombre del grupo, la id es de la conversacion
conversations.post("/group", Middlewares.authUser, async (req, res) => {
    const { id, email } = req.body;

    const emailNormalized = email.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = emailRegex.test(emailNormalized);
    
    if(!validEmail) return res.status(400).json({
        message: "Invalid email format."
    })

    const invalid_group_members = {
        errors: ["El grupo base es invalido."]
    };

    if(!isValidObjectId(id)) {
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

    console.log(emailNormalized);
    console.log(id);
    console.log(name);

    try {
        const base = await Conversation.findById(id);

        if(!base) {
            res.status(400).json(invalid_group_members);
            return;
        }

        let participantsList = [...base.participants];

        if(emailNormalized){
            const userToAdd = await User.findOne({ email: emailNormalized });
            if(!userToAdd){
                res.status(400).json({
                    message: "The user to add does not exist."
                });
                return;
            }
            if(!participantsList.some(pId => pId.equals(userToAdd._id))){
                participantsList.push(userToAdd._id);
            }
        }

        const conversation = await Conversation.create({
            name: name,
            isGroup: true,
            participants: participantsList
        });

        const conversationR = await Conversation
            .findById(conversation._id)
            .populate("participants");

        console.log(emailNormalized);
        console.log(id);
        console.log(name);

        return res.status(200).json(Jsoner.conversation(conversationR));
    }
    catch(_) {
        res.status(500).json(JSON_SERVER_ERROR);
    }
});

conversations.patch("/:id/add-participant", Middlewares.authUser, Middlewares.requireId, async (req, res) => {
    const { id } = req.params;
    const { email } = req.body;

    const emailNormalized = email.trim().toLowerCase();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const validEmail = emailRegex.test(emailNormalized);
    
    if(!validEmail) return res.status(400).json({
        message: "Invalid email."
    })

    

    /*
    const { body } = validator.parseBody(req.body);

    const empties = validator.empties(body, "email");

    if(empties.length > 0) {
        res.status(400).json({
            empties
        });
        return;
    }

    const errors = validator.validate(body);

    if(errors.length > 0){
        res.status(400).json({
            errors
        });
        return;
    }
    */

    try {
        const userToAdd = await User.findOne({
            email: emailNormalized
        });
        
        if (!userToAdd) {
            return res.status(404).json({ message: "The user with that email does not exist." });
        }

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found." });
        }

        if (conversation.participants.includes(userToAdd._id)) {
            return res.status(400).json({ message: "The user is already a member of this group." });
        }

        const alreadyExists = conversation.participants.some(pId => pId.equals(userToAdd._id));
        if(alreadyExists){
            return res.status(400).json({
                message: "The user is already a member of this group."
            })
        }

        conversation.participants.push(userToAdd._id);
        await conversation.save();

        const updatedConversation = await Conversation.findById(id).populate("participants");

        return res.status(200).json(Jsoner.conversation(updatedConversation));
    } catch (error) {
        console.error(error);
        return res.status(500).json(JSON_SERVER_ERROR);
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