import conversations from "./conversations.js";
import messages from "./messages.js";
import user from "./user.js";

const Validators = {
    user,
    messages,
    conversations
};

Object.freeze(Validators);

export default Validators;