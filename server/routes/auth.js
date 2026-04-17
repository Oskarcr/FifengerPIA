import { Models } from "#FifengerServer";
import { Router } from "express";
import bcrypt from "bcrypt";
const auth = Router();

auth.post("/signup", async (req, res) => {
    try {
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;

        console.log(req.body);

        if (!username || !email || !password) {
            return res.status(400).send("At least one of the fields is empty.");
        }

        const exists = await Models.User.findOne({ email });

        if (exists) {
            return res.status(400).send("This user already exists.");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new Models.User({
            username,
            email,
            password: hashedPassword
        })

        await user.save();

        res.status(201).send("User added successfully.");
    }
    catch (error){
        console.error(error);
        return res.status(500).send(error);
    }
});

auth.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await Models.User.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid credentials.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Incorrect password.");
        }

        return res.status(201).json({username: user.username, email: user.email });
    }
    catch (error){
        console.error(error);
        return res.status(500).send("Server error.");
    }
});

export default auth;
