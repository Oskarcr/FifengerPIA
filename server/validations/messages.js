import { isValidObjectId } from "mongoose";
import RequestValidator from "./RequestValidator.js";

const messages = new RequestValidator({
    content: {
        label: "content",
        type: String,
        validate: (text) => {
            if (text.length < 1) return "The message cannot be empty."

            if(text.length > 2000) return "The message cannot exceed 2000 characters."
        }
    },
    senderId: {
        label: "sender",
        type: String,
        validate: (id) => {
            if(!isValidObjectId(id)) return "Sender account is invalid."
        }
    },
    conversationId: {
        label: "conversation",
        type: String,
        validate: (id) => {
            if(!isValidObjectId(id)) return "This chat could not be found.";
        }
    },
    destinatorId: {
        label: "destinator",
        type: String,
        validate: (id) => {
            if(!isValidObjectId(id)) return "The receiver does not exist."
        }
    },
    isEncrypted: {
        label: "encripted",
        type: Boolean
    }
});

export default messages;