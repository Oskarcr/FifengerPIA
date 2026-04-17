import { useNavigate } from "react-router-dom"
import { useRef } from "react";
import { api } from "@/FifengerClient";

export default function Signup() {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const signup = async (evt) => {
        evt.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        try {
            await api.post("/auth/signup", data);
        }
        catch (error) {
            alert(error.response.data);
        }
    }

    return (<div id="container-wrapper">
        <div id="card-container">
            <form id="card" ref={formRef}>
                <div id="signup-title">Signup in to Fifenger</div>
                <input id="signup-username" name="username" type="text" placeholder="Username"></input>
                <input id="signup-email" name="email" type="email" placeholder="Email"></input>
                <input id="signup-password" name="password" type="password" placeholder="Password"></input>
                <span id="login-account" onClick={() => navigate("/login")}>Do you already have an account?</span>
                <button id="signup-button" type="submit" onClick={signup}>Signup</button>
            </form>
        </div>
    </div>);
}