import { useState } from "react";
import getPage from "../Routes";


export default function Login() {
    const PAGE_NAME = "login"; 
    const [pageName, setPage] = useState(PAGE_NAME);
        if(pageName != PAGE_NAME) {
            return getPage(pageName);
        }

    return (
        <div id="container-wrapper">
            <div id="card-container">
                <div id="card">
                    <div id="login-title">Login In</div>
                    <input id="login-email" type="email" placeholder="Email"></input>
                    <input id="login-password" type="password" placeholder="Password"></input>
                        <a id="login-account" onClick={() => setPage("signup")}>Don't you have account?</a>
                    <button id="login-button">Login</button>
                </div>
            </div>
        </div>
    )
}