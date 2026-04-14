import { useNavigate } from "react-router-dom"

export default function Login() {
    const navigate = useNavigate();

    return (
        <div id="container-wrapper">
            <div id="card-container">
                <div id="card">
                    <div id="login-title">Login in to Fifenger</div>
                    <input id="login-email" type="email" placeholder="Email"></input>
                    <input id="login-password" type="password" placeholder="Password"></input>
                    <span id="login-account" onClick={() => navigate("/signup")}>Don't you have account?</span>
                    <button id="login-button" type="submit" onClick={() => navigate("/chat_list")}>Login</button>
                </div>
            </div>
        </div>
    )
}