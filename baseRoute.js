//////////////////////////////////////
//          EJEMPLO DE RUTA         //
//////////////////////////////////////

const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    next();
});

router.get("/", (req, res) => {
    res.send("si");
});

router.get("/test", (req, res) => res.send("Hola desde test"));

module.exports = router;