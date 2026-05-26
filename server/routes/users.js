import { User } from "#FifengerModels";
import { JSON_NOT_FOUND, JSON_SERVER_ERROR, Jsoner, Middlewares, PROJECT_DIR, Validators } from "#FifengerServer";
import { Router } from "express";
import { readFileSync } from "fs";
import { isValidObjectId } from "mongoose";
import Path from "path";

const validator = Validators.user;

const profile_decorations = JSON.parse(readFileSync(
    Path.join(PROJECT_DIR, "src", "json", "profile_decorations.json"),
    "utf-8"
));

const users = Router();

users.get("/search", Middlewares.authUser, async (req, res) => {
    try {
        const query = req.query;
        delete query.password;
        if (!query || Object.keys(query).length === 0) {
            res.status(400).json(JSON_NOT_FOUND);
            return;
        }
        const user = await User.findOne({
            ...query
        });

        if(!user) {
            res.status(400).json(JSON_NOT_FOUND);
            return;
        }

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
    Middlewares.authUser,
    async (req, res) => {
        const id = parseInt(req.params.id);
        // @ts-ignore
        const { id: userId } = req.user;
        const item = profile_decorations[id];
        if(!item) {
            res.status(404).json(JSON_NOT_FOUND);
            return;
        }
        try {
            const query = {};
            if(item.type === "banner") query.bannerId = id;
            else query.photoId = id;
            const user = await User.findById(userId);
            
            if(!user.inventory.includes(id) && id !== 1 && id !== 2) {
                res.status(400).json({
                    errors: ["You do not have this item in your inventory."]
                })
                return;
            }

            await user.updateOne(query);

            res.status(200).json(Jsoner.user(user));
        }
        catch(_) {
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

users.get("/:id", 
    Middlewares.authUser,
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

users.patch("/me", 
    Middlewares.authUser, 
    async (req,res) => {
        // @ts-ignore
        const userId = req.user.id + "";

        const body = validator.parseBody(req.body);

        const empties = validator.empties(body, "username", "email")
        
        if(empties.length > 0){
            res.status(400).json({
                empties
            });
            return;
        }

        const errors = validator.validate(body)

        if(errors.length > 0){
            res.status(400).json({
                errors
            });
            return;
        }
        
        const { username, email } = body;

        try{
            const user = await User.findByIdAndUpdate(userId, {
                username: username,
                email: email
            },
            {returnDocument: "after"}
        );

            if(!user){
                res.status(400).json({
                    message: "User not found."
                });
                return;
            }

            res.status(200).json(Jsoner.user(user));
        }
        catch(error){
            console.log(error);
            res.status(500).json(JSON_SERVER_ERROR);
        }
    }
);

users.post("/logout", Middlewares.authUser, (req, res) => {
    console.log("Galleta cerrada.");
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });
    res.status(200).json({ message: "Successfully closed session."});
});

export default users;