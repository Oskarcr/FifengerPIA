import { ServerRoutes } from "#FifengerServer";
import { Router } from "express";

const api = Router();

api.get("/", (req, res) => {
    res.send("Hello World!");
});

api.use("/hola", ServerRoutes.hola);

api.use("/test", ServerRoutes.test);

api.use("/auth", ServerRoutes.auth);

export default api;