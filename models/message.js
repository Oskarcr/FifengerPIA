import { Schema, model } from "mongoose";

const MessageSchema = new Schema({
    username: String,
    content: String,
    time: Number,
    path: String,
    isEncripted: Boolean
});

export default model("Message", MessageSchema);