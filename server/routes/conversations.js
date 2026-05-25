import { Conversation, User } from "#FifengerModels";
import { Router } from "express";
import { isValidObjectId, Types } from "mongoose";
import { Attachments, JSON_NOT_FOUND, JSON_SERVER_ERROR, Jsoner, Middlewares, Validators } from "#FifengerServer";

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

    try {
        const conversationBase = await Conversation.findById(id);

        if(!conversationBase) {
            res.status(400).json(invalid_group_members);
            return;
        }

        let participantsList = [...conversationBase.participants];

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

        const conversationExists = await Conversation.findOne({
            isGroup: true,
            name: name,
            participants: { $all: participantsList, $size: participantsList.length}
        });

        if (conversationExists) {
            return res.status(200).json(
                Jsoner.conversation(
                    await conversationExists.populate("participants")
                )
            );
        }

        const conversation = await Conversation.create({
            name: name,
            isGroup: true,
            participants: participantsList
        });

        await conversation.populate("participants");

        res.status(200).json(Jsoner.conversation(conversation));
    }
    catch(_) {
        res.status(500).json(JSON_SERVER_ERROR);
    }
});


conversations.patch("/:id/add-participant", 
    Middlewares.authUser, 
    Middlewares.requireId, 
    async (req, res) => {
        const { id } = req.params;
        const { email } = req.body;

        const emailNormalized = email.trim().toLowerCase();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const validEmail = emailRegex.test(emailNormalized);

        if(!validEmail) return res.status(400).json({
            errors: ["Invalid email."]
        });

        try {

            console.log(emailNormalized);
            console.log(id);
            const userToAdd = await User.findOne({
                email: emailNormalized
            });

            if (!userToAdd) {
                return res.status(404).json({ message: "The user with that email does not exist." });
            }
            console.log("Paso si el usuario se encontro");

            const conversation = await Conversation.findById(id);
            if (!conversation) {
                return res.status(404).json({ message: "Conversation not found." });
            }
            console.log("Paso si existe la conversacion");

            if (!conversation.isGroup) {
                return res.status(400).json({
                    message: "Cannot add participants to a private conversation."
                });
            }

            const alreadyExists = conversation.participants.some(pId => pId.equals(userToAdd._id));
            console.log(alreadyExists);
            console.log(conversation.participants);
            console.log(userToAdd._id.toString());
            if(alreadyExists){
                return res.status(400).json({
                    message: "The user is already a member of this group."
                })
            }
            console.log("Paso si ya existe el usuario");

            conversation.participants.push(userToAdd._id);
            await conversation.save();

            const updatedConversation = await Conversation.findById(id).populate("participants");

            console.log("Paso al 200");
            return res.status(200).json(Jsoner.conversation(updatedConversation));
        } catch (error) {
            console.error(error);
            return res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

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