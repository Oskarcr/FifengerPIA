import { Link as RouterLink } from "react-router-dom";

export default function ChatOption({ photoSrc = "/LTG.jpg", to = "/chats", name = "Loading...", isOnline = false }) {

    return (
        <RouterLink to={to} className="chat-option" onClick={() => onClick()}>
            <div className="chat-option-image">
                <img src={photoSrc} />
                <div className="chat-option-status" style={{ display: isOnline ? "block" : "none" }}></div>
            </div>
            <div className="chat-option-username">{name}</div>
        </RouterLink>);
}