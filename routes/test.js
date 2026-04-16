import { Router } from "express";
const test = Router();

test.get("/", (req, res) => {
    res.send("Hola desde test");
});

export default test;
