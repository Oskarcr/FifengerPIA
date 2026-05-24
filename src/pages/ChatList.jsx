import { api, Components, Items } from "@/FifengerClient";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

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

    const didFetch = useRef(false);

    useEffect(() => {
        if(didFetch.current) return;
        didFetch.current = true;
        (async () => {
            const userId = sessionStorage.getItem("id");
            api.get("/conversations?userId=" + userId).then((response) => {
                setConversations(response.data);
            });
        })();
    }, []);
    
    for(let i = 0; i < conversations.length; i++) {
        const item = conversations[i];
        let user = null;
        let name = null;
        let photoUrl = null;
        console.log(item);
        if(item.isGroup) {
            name = item.name;
            photoUrl = "fifa.png";
        }
        else {
            user = item.participants.find(a => a.username != username);
            name = user.username;
            photoUrl = Items.get(user.photoId).url;
        }
        children.push(<Components.ChatOption 
            name={name} 
            photoSrc={"/rewards/" + photoUrl}
            to={"/chats/" + conversations[i]._id}
            isOnline={user?.status === 1}
        />);
    }

    const searchConversation = async () => {
        const value = searchInputRef.current.value;
        try {
            console.log(value);
            const response = await api.get("/users/search?email=" + value);
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

    return (
    <>
        {showMessage && (
            <Components.MessageBox title={title} content={message} onConfirm={() => {
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