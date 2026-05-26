import { Schema, model } from "mongoose";
import * as crypto from "crypto";

const ConversationSchema = new Schema({
    isGroup: Boolean,
    name: String,
    encryptionEnabled: {
        type: Boolean,
        required: true,
        default: false
    },
    // Fifenger Encrypted Local Key 
    felk: {
        type: String,
        required: true,
        default: () => crypto.randomBytes(16).toString("hex")
    },
    tasks: [{
        title: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            required: true,
            default: false
        },
    }],
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;