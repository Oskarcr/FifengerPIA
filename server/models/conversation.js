import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
    isGroup: Boolean,
    name: String,
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }]
});

const Conversation = model("Conversation", ConversationSchema);

export default Conversation;