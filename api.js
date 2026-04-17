import { Router } from "express";
import test from "./routes/test.js";
import hola from "./routes/hola.js";
import auth from "./routes/auth.js";

const api = Router();

/*router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});*/

api.get("/", (req, res) => {
    res.send("Si");
});

api.use("/hola", hola);

api.use("/test", test);

api.use("/auth", auth);

export default api;