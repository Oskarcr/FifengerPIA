import { isValidObjectId } from "mongoose";
import RequestValidator from "./RequestValidator.js";

const conversation = new RequestValidator({
    id: {
        label: "conversation",
        type: String,
        validate: (id) => {
            if(!isValidObjectId(id)) return "Invalid conversation ID."
        }
    },
    userId: {
        label: "user",
        type: String,
        validate: (id) => {
            if(!isValidObjectId(id)) return "Invalid user ID."
        }
    },
    name: {
        label: "name",
        type: String,
        normalize: (a) => a.trim().replace(/\s+/, " "),
        validate: (name) => {
            const nameRegex = /^[\sA-Za-z]{3,100}$/;
            const validName = nameRegex.test(name);
            if (!validName) return "The name must have at least 3 characters, must not have numbers or symbols.";
        }
    },
    isGroup: {
        label: "group",
        type: Boolean
    }
});

export default conversation;