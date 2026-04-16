const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    status: Number,
    inventory: [Number]
})

module.exports = mongoose.model("User", UserSchema);