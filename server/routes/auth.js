import { Models } from "#FifengerServer";
import { Router } from "express";
import bcrypt from "bcrypt";
import Validators from "../validations/main.js";
const auth = Router();
const validator = Validators.user;

auth.post("/signup", async (req, res) => {
    try {
        const body = validator.parseBody(req.body);

        const empties = validator.empties(body, "username", "email", "password");

        if (empties.length > 0) {
            res.status(400).json({
                empties
            });
            return;
        }

        const errors = validator.validate(body);

        if (errors.length > 0) {
            res.status(400).json({
                errors
            });
            return;
        }

        const exists = await Models.User.findOne({ email: normalizedEmail });
        if (exists) {
            return res.status(409).send("This user already exists.");
        }

        const normalizedPassword = normalizePassword(password);
        if(!normalizedPassword){
            return res.status(401).send("The password must contain at least 8 characters, one upper and one lower case");
        }

        const user = new Models.User({
            username,
            email: normalizedEmail,
            password: hashedPassword
        })

        await user.save();

        res.status(201).send("User added successfully.");
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

auth.post("/login", async (req, res) => {
    try {
        /**@type {string} */
        const email = req.body.email;
        /**@type {string} */
        const password = req.body.password;

        if (!email || !password) {
            return res.status(400).send("At least one of the fields is empty.");
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();

        const user = await Models.User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }

        const isMatch = await bcrypt.compare(normalizedPassword, user.password);
        if (!isMatch) {
            return res.status(401).send("Invalid credentials.");
        }

        /*const userPayLoad = {
            id: user.id,
            username: user.username
        }

        const token = jwt.sign(userPayLoad, process.env.JWT_SECRET, {expiresIn: "24h"});*/
        
        return res.status(201).send({username: user.username, email: user.email, _id: user._id });
        
        /*return res.status(200).json({
            username: user.username,
            token: token
        });
            return res.status(400).send("Incorrect password.");
        }*/

    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    }
});

export default auth;
