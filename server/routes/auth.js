import { Router } from "express";
import bcrypt from "bcrypt";
import { Jsoner, Validators } from "#FifengerServer";
import { User } from "#FifengerModels";
import jwt from "jsonwebtoken"
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

        const { username, email, password } = body;

        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({
                message: "This user already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username,
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        res.status(201).json({
            message: "User added successfully."
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
});

auth.post("/login", async (req, res) => {

    const body = validator.parseBody(req.body);

    const empties = validator.empties(body, "email", "password");

    if(empties.length > 0){
        res.status(400).json({
            empties
        });
        return;
    }

    const errors = validator.validate(body);

    if(errors.length > 0){
        res.status(400).json({
            errors
        })
        return;
    }

    const { email, password } = body;

    try{
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({
                message: "User not found."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials."
            });
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            username: user.username,
        }, process.env.JWT_SECRET);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });

        return res.status(200).json(Jsoner.user(user));
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error."
        });
    }
});

export default auth;