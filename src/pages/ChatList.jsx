import { api, Components } from "@/FifengerClient";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBox from "../components/MessageBox.jsx";

export default function ChatList() {
    const delay = 0.15 * 1000;

    /**@type {import("react").RefObject<HTMLInputElement>} */
    const searchInputRef = useRef(null);
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const username = sessionStorage.getItem("username");
        
    const children = [];
    
    for(let i = 0; i < conversations.length; i++) {
        const item = conversations[i];
        const name = item.isGroup ? item.name : item.participants.find(a => a.username != username)?.username;
        children.push(<Components.ChatOption 
            name={name} 
            to={"/chats/" + conversations[i]._id}
        />);
    }

    const searchConversation = async () => {
        const value = searchInputRef.current.value;
        try {
            const response = await api.get("users/search?email=" + value);
            navigate("temp/" + response.data._id);
            /*const id = response.data[0]._id;
            navigate("/chat/" + id);*/
        }
        catch(error) {
            console.log(error);

            const data = error.response.data;

            setTitle("Error");

            setMessage(data);

            setShowMessage(true);
        }
        
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            const userId = sessionStorage.getItem("id");
            api.get("conversations?userId=" + userId).then((response) => {
                setConversations(response.data);
            });
        }, delay);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
    <>
        {showMessage && (
            <MessageBox title={title} content={message} onConfirm={() => {
                setShowMessage(false);
            }}/>
        )}

        <div id="header">
            <Components.ButtonIcon icon="menu" onClick={() => navigate("/menu")} />
            <div className="header-search-container">
                <input type="text" placeholder="Search user by email" ref={searchInputRef}/>
                <Components.ButtonIcon onClick={() => searchConversation()} icon="search" />
            </div>
        </div>
        <div id="root-content" style={{
            flexDirection: "column",
            gap: "var(--spacing-short)",
            padding: "var(--spacing-short)",
            alignItems: "center"
        }}>
            {children}
        </div>
    </>
    );
}