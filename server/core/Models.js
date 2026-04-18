
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import Objetive from "../models/objetive.js";
import User from "../models/user.js";
import { Types } from "mongoose";

const Models = {
    Conversation,
    Message,
    Objetive,
    User,
    isObjectId: Types.ObjectId.isValid,
};

export default Models;