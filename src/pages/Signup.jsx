import { useNavigate } from "react-router-dom"

export default function Signup() {
    const navigate = useNavigate();

    return (<div id="container-wrapper">
        <div id="card-container">
            <div id="card">
                <div id="signup-title">Signup in to Fifenger</div>
                <input id="signup-username" type="text" placeholder="Username"></input>
                <input id="signup-email" type="email" placeholder="Email"></input>
                <input id="signup-password" type="password" placeholder="Password"></input>
                
                    <span id="login-account" onClick={() => navigate("/login")}>Do you already have an account?</span>
                <button id="signup-button" onClick={() => navigate("/chat_list")}>Signup</button>
            </div>
        </div>
    </div>);
}