import express from "express";
import api from "./api.js";

const SUPABASE_URL = process.env["SUPABASE_URL"];

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

app.use("/api", api);

app.get("/attachments/:fileName", (req, res) => {
    const { fileName } = req.params;
    const url = SUPABASE_URL + "/storage/v1/object/public/attachments/" + fileName;
    res.redirect(url);
});

app.get("/", (req, res) => res.send("Hello world!"));

export default app;