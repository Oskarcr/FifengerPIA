import { Models } from "#FifengerServer";
import { Router } from "express";
const users = Router();

const USER_FIELDS = "username email status inventory";

users.get("/search", async (req, res) => {
    try {
        const query = req.query;
        delete query.password;
        if (!query || Object.keys(query).length === 0) {
            return res.status(400).send("User not found");
        }
        const user = await Models.User.findOne({
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

    if(!Models.isObjectId(id)) return res.status(400).send("User not found");

    const user = await Models.User.findById(id).select(USER_FIELDS);

    if(!user) return res.status(400).send("User not found");
    res.send(user);
});

export default users;