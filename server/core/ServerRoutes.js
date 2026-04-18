import conversations from "../routes/conversations.js";
import auth from "../routes/auth.js";
import hola from "../routes/hola.js";
import test from "../routes/test.js";
import messages from "../routes/messages.js";
import users from "../routes/users.js";

const ServerRoutes = {
    auth,
    conversations,
    messages,
    users,
    hola,
    test
};

export default ServerRoutes;