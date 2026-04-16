import express from "express";
import api from "./api.js";
import mongoose from "mongoose";

const app = express();
const port = process.env["SERVER_PORT"];
const url = process.env["DATABASE_URL"];

/**
 * Inicia el servidor!
 */
class Server {
    static #started = false;

    /**
     * Intenta iniciar el servizor.
     */
    static async start() {
        if(Server.#started) return;
        Server.#started = true;
        try {
            await mongoose.connect(url);
            console.log("Database connected sucessfully");
        }
        catch(err) {
            console.log("Could not connect to the database");
            console.error(err);
            return;
        }
        Server.#configurate();
        app.listen(port, () => {
            console.log("App listeting on http://localhost:" + port);
        });

    }

    /**
     * Configura el servidor.
     */
    static #configurate() {
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Origin", "http://localhost:5173");
            res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            next();
        });
        app.use("/static", express.static("public"));
        app.use("/api", api);
        app.get("/", (req, res) => res.send("Hello world!"));
    }
}

Server.start();