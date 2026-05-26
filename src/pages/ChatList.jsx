import { api, Components, Items, socket } from "@/FifengerClient";
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
        const onUserStatusChange = (data) => {
            const { userId, status } = data;
            console.log(data);
            setConversations(prev => {
                return prev.map(conversation => {
                    if (conversation.isGroup) return conversation;
                    console.log(conversation);
                    return {
                        ...conversation,
                        participants: conversation.participants.map(user => {
                            if (user.id === userId) return {
                                ...user,
                                status
                            };
                            return user;
                        })
                    };
                });
            });
        };

        socket.on("user_status_change", onUserStatusChange);
    
        return () => {
            socket.off("user_status_change", onUserStatusChange);
        };
    }, []);

    useEffect(() => {
        if(didFetch.current) return;
        didFetch.current = true;
    
        (async () => {
            const userId = sessionStorage.getItem("id");
            const { data } = await api.get("/conversations?userId=" + userId);
            setConversations(data);
        })();
    }, []);
    
    for(let i = 0; i < conversations.length; i++) {
        const item = conversations[i];
        let user = null;
        let name = null;
        let photoUrl = null;
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
            to={"/chats/" + conversations[i].id}
            isOnline={user?.status === 2}
        />);
    }

    const searchConversation = async () => {
        const value = searchInputRef.current.value;
        try {
            const response = await api.get("/users/search?email=" + value);
            navigate("/chats/temp/" + response.data.id);
        }
        catch(error) {
            setTitle("Alert")
            setMessage("User not found");
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