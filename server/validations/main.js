import conversation from "./conversation.js";
import messages from "./messages.js";
import user from "./user.js";

const Validators = {
    user,
    messages,
    conversation
};

Object.freeze(Validators);

export default Validators;