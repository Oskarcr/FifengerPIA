import express from "express";
import api from "./api.js";
import { ATTACHMENTS_DIR } from "#FifengerServer";

const app = express();

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

app.use(express.json());

app.use("/static", express.static("public"));

app.use("/attachments", express.static(ATTACHMENTS_DIR));

app.use("/api", api);

app.get("/", (req, res) => res.send("Hello world!"));

export default app;