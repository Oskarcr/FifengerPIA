import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    status: Number,
    inventory: [Number]
});

const User = model("User", UserSchema);

export default User;