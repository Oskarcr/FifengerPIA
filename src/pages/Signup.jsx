import { useState } from "react";
import getPage from "../Routes";

export default function Signup() {
    const PAGE_NAME = "signup";
    const [pageName, setPage] = useState(PAGE_NAME);
    if (pageName != PAGE_NAME) {
        return getPage(pageName);
    }

    return (
        <div id="container-wrapper">
            <div id="card-container">
                <div id="card">
                    <div id="signup-title">Signup in to Fifenger</div>
                    <input id="signup-username" type="text" placeholder="Username"></input>
                    <input id="signup-email" type="email" placeholder="Email"></input>
                    <input id="signup-password" type="password" placeholder="Password"></input>
                    <button id="signup-button" onClick={() => setPage("chat_list")}>Signup</button>
                </div>
            </div>
        </div>
    )
}