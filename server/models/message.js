import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: String,
    isEncrypted: Boolean,
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: "Conversation"
    }
}, {
    timestamps: true
});

MessageSchema.index({
    conversationId: 1, 
    createdAt: -1
});

export default model("Message", MessageSchema);