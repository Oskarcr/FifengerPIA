const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatSchema = new Schema({
    isGroup: Boolean,
    name: String,
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

module.exports = mongoose.model("Chat", ChatSchema);