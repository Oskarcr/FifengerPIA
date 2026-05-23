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

MessageSchema.pre("find", function() {
    this.sort({ createdAt: -1 }).limit(50);
});

const Message = model("Message", MessageSchema);

export default Message;