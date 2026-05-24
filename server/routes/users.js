import { User } from "#FifengerModels";
import { JSON_NOT_FOUND, JSON_SERVER_ERROR, Jsoner, Middlewares, PROJECT_DIR } from "#FifengerServer";
import { Router } from "express";
import { readFileSync } from "fs";
import { isValidObjectId } from "mongoose";
import Path from "path";

const profile_decorations = JSON.parse(readFileSync(
    Path.join(PROJECT_DIR, "src", "json", "profile_decorations.json"),
    "utf-8"
));

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

users.patch("/buy/:id", 
    async (req, res) => {
        const userId = req.body.userId;
        const id = parseInt(req.params.id + "");
        const item = profile_decorations[(id + "")];
        console.log(item);
        if(!item) {
            res.status(400).json(JSON_NOT_FOUND);
            return;
        }
        
        try {
            const user = await User.findById(userId);
            if(!user) {
                res.status(404).json(JSON_NOT_FOUND);
                return;
            }

            const inventory = user.inventory;
            if(inventory.includes(id)) {
                res.status(400).json({
                    errors: ["You have already obtained this item"]
                });
                return;
            }

            if(user.get("points") < item.points) {
                res.status(400).json({
                    errors: ["You do not have enough points to purchase this item."]
                });
                return;
            }

            inventory.push(id);
            user.points -= item.points;
            await user.save();

            res.status(200).json(Jsoner.user(user));
        }
        catch(_) {
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

users.patch("/activate/:id", 
    Middlewares.requireId,
    (req, res) => {
        const { id } = req.params;
        
    }
);

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