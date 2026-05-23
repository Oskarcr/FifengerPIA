import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: String,
    email: String,
    password: String,
    status: Number,
    photoId: {
        type: Number,
        required: true,
        default: 1
    },
    bannerId: {
        type: Number,
        required: true,
        default: 2
    },
    inventory: [Number]
});

const User = model("User", UserSchema);

export default User;