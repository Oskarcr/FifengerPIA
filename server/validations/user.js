import RequestValidator from "./RequestValidator.js";

const user = new RequestValidator({
    username: {
        label: "nombre",
        type: String,
        normalize: (a) => a.trim().replace(/\s+/, " "),
        validate: (name) => {
            const usernameRegex = /^[\sA-Za-z]{3,100}$/;
            const validUsername = usernameRegex.test(name);
            if (!validUsername) return "The user must have at least 3 characters, must not have numbers or symbols.";
        }
    },
    email: {
        label: "correo",
        type: String,
        normalize: (a) => a.trim().toLowerCase(),
        validate: (email) => {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const validEmail = emailRegex.test(email);
            if (!validEmail) return "A valid email must be provided.";
        }
    },
    password: {
        label: "contraseña",
        type: String,
        validate: (password) => {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
            const validPassword = passwordRegex.test(password);
            if (!validPassword) return "The password must be at least 8 characters, 1 uppercase and 1 lowercase.";
        }
    }
});

export default user;