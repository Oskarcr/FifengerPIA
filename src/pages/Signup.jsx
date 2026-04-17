import { useNavigate } from "react-router-dom"
import { useEffect, useRef } from "react";
import { api } from "@/Fifenger";

export default function Signup() {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const signup = async (evt) => {
        try {
            evt.preventDefault();
            const response = await api.postForm("/auth/signup", formRef.current);
            alert(response.statusText);
        }
        catch (error) {
            console.log(error);
            alert("Server.error");
        }
    }

    return (<div id="container-wrapper">
        <div id="card-container">
            <form id="card" ref={formRef}>
                <div id="signup-title">Signup in to Fifenger</div>
                <input id="signup-username" type="text" placeholder="Username"></input>
                <input id="signup-email" type="email" placeholder="Email"></input>
                <input id="signup-password" type="password" placeholder="Password"></input>
                <span id="login-account" onClick={() => navigate("/login")}>Do you already have an account?</span>
                <button id="signup-button" type="submit" onClick={signup}>Signup</button>
            </form>
        </div>
    </div>);
}