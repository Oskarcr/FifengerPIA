import { api, Components } from "@/FifengerClient";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function ChatList() {
    const navigate = useNavigate();

    useEffect(() => {
    const user = sessionStorage.getItem("email");
    if (!user) {
        alert("Debes iniciar sesión.");
        navigate("/login");
    } else {
        console.log("Bienvenido:", sessionStorage.getItem("username"));
    }
}, []);

    return (<>
        <div id="header">
            <Components.ButtonIcon icon="menu" onClick={() => navigate("/menu")} />
            <div className="header-search-container">
                <input type="text" placeholder="Search user by username" />
                <Components.ButtonIcon icon="search" />
            </div>
        </div>
        <div id="root-content" style={{
            flexDirection: "column",
            gap: "var(--spacing-short)",
            padding: "var(--spacing-short)",
            alignItems: "center"
        }}>
            <Components.ChatOption onClick={() => navigate("/chat")} />
            <Components.ChatOption onClick={() => navigate("/chat")} />
            <Components.ChatOption onClick={() => navigate("/chat")} />
        </div>
    </>);
}