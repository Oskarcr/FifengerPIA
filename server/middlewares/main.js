import authUser from "./authUser.js";
import requireId from "./requireId.js";

const Middlewares = {
    requireId,
    authUser
};

Object.freeze(Middlewares);

export default Middlewares;