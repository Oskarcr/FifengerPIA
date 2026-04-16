import { Router } from "express";
import test from "./routes/test.js";

const api = Router();

/*router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});*/

api.get("/", (req, res) => {
    res.send("Si");
});

api.use("/test", test);

export default api;