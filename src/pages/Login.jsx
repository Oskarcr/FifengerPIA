import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { api } from "@/Fifenger";

export default function Login() {
    const navigate = useNavigate();

    const formRef = useRef(null);

    const login = async (evt) => {
        try {
            evt.preventDefault();
            const response = await api.postForm("/api/login", formRef.current);
            alert(response.statusText);
        }
        catch (error) {
            console.error(error);
            alert("Server connection error.");
        }
    }

    return (
        <div id="container-wrapper">
            <div id="card-container">
                <form id="card">
                    <div id="login-title">Login in to Fifenger</div>
                    <input id="login-email" type="email" placeholder="Email"></input>
                    <input id="login-password" type="password" placeholder="Password"></input>
                    <span id="login-account" onClick={() => navigate("/signup")}>Don't you have account?</span>
                    <button id="login-button" type="submit" onClick={login}>Login</button>
                </form>
            </div>
        </div>
    )
}