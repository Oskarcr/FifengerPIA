import { Schema, model } from "mongoose";

const ObjetiveSchema = new Schema({
    title: String,
    tasks: [String],
    chat: {
        type: Schema.Types.ObjectId,
        ref: "Chat"
    }
});

export default model("Objetive", ObjetiveSchema);