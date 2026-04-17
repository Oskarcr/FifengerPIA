import { api, Components } from "@/FifengerClient";
import { useNavigate } from "react-router-dom";

export default function ChatList() {
    const navigate = useNavigate();

    /*
    useEffect(() => {
        api.get("/auth")
            .then(res => {
                console.log("Welcome back.", res.data);
            })
            .catch(err => {
                console.error("You are not logged in.");
                alert("You must be log in nigga.");
                navigate("/login");
            });
    }, []);
    */

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