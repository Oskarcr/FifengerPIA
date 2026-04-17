import { Schema, model } from "mongoose";

const ChatSchema = new Schema({
    isGroup: Boolean,
    name: String,
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

export default model("Chat", ChatSchema);