const mongoose = require("mongoose");
const { Schema } = mongoose;

const ObjetiveSchema = new Schema({
    title: String,
    tasks: [String],
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }
})

module.exports = mongoose.model("Objetive", ObjetiveSchema);