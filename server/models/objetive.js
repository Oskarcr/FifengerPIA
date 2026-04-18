import { Schema, model } from "mongoose";

const ObjetiveSchema = new Schema({
    title: String,
    tasks: [String],
    conversation: {
        type: Schema.Types.ObjectId,
        ref: "Conversation"
    }
});

export default model("Objetive", ObjetiveSchema);