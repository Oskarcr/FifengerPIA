import { Router } from "express";
const hola = Router();

hola.get("/", (req, res) => {
    res.send("Hola");
});

hola.put("/users", (req, res) => {
    res.send();
});

export default hola;
