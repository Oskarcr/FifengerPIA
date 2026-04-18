import { Models } from "#FifengerServer";
import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const auth = Router();

/**
 * Valida y normaliza el email
 * @param {string} email
 * @returns {string|null}
 */
function normalizeEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
        return null;
    }
    return normalizedEmail;
}

/**
 * Valida y normaliza la password
 * @param {string} password
 * @returns {string|null}
 */
function normalizePassword(password){
    const normalizedPassword = password.trim();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if(!passwordRegex.test(normalizedPassword)){
        return null;
    }
    return normalizedPassword;
}

auth.post("/signup", async (req, res) => {
    try {
        /**@type {string} */
        const email = req.body.email;
        /**@type {string} */
        const username = req.body.username;
        /**@type {string} */
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(400).send("At least one of the fields is empty.");
        }

        const normalizedEmail = normalizeEmail(email)
        if(!normalizedEmail){
            return res.status(401).send("Invalid email");
        }
        const exists = await Models.User.findOne({ email: normalizedEmail });
        if (exists) {
            return res.status(409).send("This user already exists.");
        }

        const normalizedPassword = normalizePassword(password);
        if(!normalizedPassword){
            return res.status(401).send("The password must contain at least 8 characters, one upper and one lower case");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(normalizedPassword, salt);

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

        const userPayLoad = {
            id: user.id,
            username: user.username
        }

        const token = jwt.sign(userPayLoad, process.env.JWT_SECRET, {expiresIn: "24h"});
        return res.status(200).json({
            username: user.username,
            token: token
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send("Server error.");
    }
});

export default auth;
