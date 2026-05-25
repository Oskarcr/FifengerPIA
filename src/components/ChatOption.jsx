import { Link as RouterLink, useNavigate } from "react-router-dom";

export default function ChatOption({ photoSrc = "/LTG.jpg", to = "/chats", name = "Loading...", isOnline = false }) {
    const navigate = useNavigate();
    return (
        <div className="chat-option" onClick={() => navigate(to)}>
            <div className="chat-option-image">
                <img src={photoSrc} />
                <div className="chat-option-status" style={{ display: isOnline ? "block" : "none" }}></div>
            </div>
            <div className="chat-option-username">{name}</div>
        </div>);
}