import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    status: Number,
    inventory: [Number]
});

export default model("User", UserSchema);