const mongoose = require("mongoose");
const { Schema } = mongoose;

const MessageSchema = new Schema({
    username: String,
    content: String,
    time: Number,
    path: String,
    isEncripted: Boolean
})

module.exports = mongoose.model("Message", MessageSchema);