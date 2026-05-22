import { User } from "#FifengerModels";
import { Router } from "express";
import { isValidObjectId } from "mongoose";
const users = Router();

const USER_FIELDS = "username email status inventory";

users.get("/search", async (req, res) => {
    try {
        const query = req.query;
        delete query.password;
        if (!query || Object.keys(query).length === 0) {
            return res.status(400).send("User not found");
        }
        const user = await User.findOne({
            ...query
        })
        .select(USER_FIELDS);

        if(!user) return res.status(400).send("User not found");

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("Search error");
    }
});

users.get("/:id", async (req, res) => {
    const { id } = req.params;

    if(!isValidObjectId(id)) return res.status(400).send("User not found");

    const user = await User.findById(id).select(USER_FIELDS);

    if(!user) return res.status(400).send("User not found");
    res.send(user);
});

export default users;