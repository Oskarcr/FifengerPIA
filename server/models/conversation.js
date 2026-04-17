import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
    isGroup: Boolean,
    name: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

export default model("Conversation", ConversationSchema);