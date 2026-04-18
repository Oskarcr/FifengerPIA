import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { api } from "@/FifengerClient";

export default function Login() {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const login = async (evt) => {
        evt.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await api.post("/auth/login", data);
            sessionStorage.setItem("token", response.data.token);
            sessionStorage.setItem("username", response.data.username);
            navigate("/chat_list");
        }
        catch (error) {
            alert(error.response.data); 
        }
    }

    return (
        <div id="container-wrapper">
            <div id="card-container">
                <form id="card" ref={formRef}>
                    <div id="login-title">Login in to Fifenger</div>
                    <input id="login-email" name="email" type="email" placeholder="Email"></input>
                    <input id="login-password" name="password" type="password" placeholder="Password"></input>
                    <span id="login-account" onClick={() => navigate("/signup")}>Don't you have account?</span>
                    <button id="login-button" type="submit" onClick={login}>Login</button>
                </form>
            </div>
        </div>
    )
}