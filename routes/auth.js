import { Router } from "express";
import User from "../models/user.js"
import bcrypt from "bcrypt" 
const auth = Router();

auth.post("/signup", async (req, res) => {
    try {
        console.log("HOLA");
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(400).json({ msg: "At least one of the fields is empty." });
        }

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({ msg: "This user already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword
        })

        await user.save();

        res.status(201).json({ msg: "User added successfully."});
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ msg: "Server error."});
    }
   res.send("hola");
});

auth.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Incorrect password." });
        }

        return res.status(201).json({
            msg: "Login successful",
            user: { username: user.username, email: user.email }
        });
    }
    catch (error){
        console.error(error);
        return res.status(500).json({ msg: "Server error."});
    }
});

export default auth;
