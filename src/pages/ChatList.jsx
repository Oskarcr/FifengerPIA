import { Components } from "@/Fifenger";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
    const navigate = useNavigate();
    return (<>
        <div id="header">
            <Components.ButtonIcon icon="menu" onClick={() => navigate("/menu")}/>
            <div className="header-search-container">
                <input type="text" placeholder="Search user by username"/>   
                <Components.ButtonIcon icon="search"/>
            </div>
        </div>
        <div id="root-content" style={{
            flexDirection: "column",
            gap: "var(--padding-short)",
            padding: "var(--padding-short)",
            alignItems: "center"
        }}>
            <Components.ChatOption onClick={() => navigate("/chat")}/>
            <Components.ChatOption onClick={() => navigate("/chat")}/>
            <Components.ChatOption onClick={() => navigate("/chat")}/>
        </div>
    </>);
}