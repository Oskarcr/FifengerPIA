import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({email,password})
            })

            const data = await response.json();

            if(response.ok) {
                data.msg;
                navigate("/chat_list")
            }
            else data.msg;
        }
        catch (error){
            alert("Server connection error.")
            console.error(error);
        }
    }

    return (
        <div id="container-wrapper">
            <div id="card-container">
                <div id="card">
                    <div id="login-title">Login in to Fifenger</div>
                    <input id="login-email" type="email" placeholder="Email" onChange={(evt) => setEmail(evt.target.value)}></input>
                    <input id="login-password" type="password" placeholder="Password" onChange={(evt) =>setPassword(evt.target.value)}></input>
                    <span id="login-account" onClick={() => navigate("/signup")}>Don't you have account?</span>
                    <button id="login-button" type="submit" onClick={login}>Login</button>
                </div>
            </div>
        </div>
    )
}