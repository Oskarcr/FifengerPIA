import { User } from "#FifengerModels";
import { JSON_NOT_FOUND, JSON_SERVER_ERROR, Jsoner, Middlewares } from "#FifengerServer";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
const users = Router();

users.get("/search", async (req, res) => {
    try {
        const query = req.query;
        delete query.password;
        if (!query || Object.keys(query).length === 0) {
            return res.status(400).send("User not found");
        }
        const user = await User.findOne({
            ...query
        });

        if(!user) return res.status(400).send("User not found");

        res.status(200).json(Jsoner.user(user));
    } 
    catch (_) {
        res.status(500).json(JSON_SERVER_ERROR);
    }
});

users.get("/:id", 
    Middlewares.requireId,
    async (req, res) => {
        const { id } = req.params;

        if(!isValidObjectId(id)) {
            res.status(400).json(JSON_NOT_FOUND);
            return;
        }

        const user = await User.findById(id);

        if(!user) {
            res.status(400).json(JSON_NOT_FOUND);
            return;
        }

        res.json(Jsoner.user(user));
    }
);

export default users;