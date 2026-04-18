import { Components, api } from "@/FifengerClient";
import "../css/Chat.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function Chat() {
    const delay = 0.15 * 1000;
    /**@type {import("react").RefObject<HTMLInputElement>} */
    const messageInputRef = useRef(null);
    const { destinatorId, conversationId } = useParams();
    const [label, setLabel] = useState("Loading...");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    const isTemp = !!destinatorId;

    useEffect(() => {
        const username = sessionStorage.getItem("username");
        
        const timer = setTimeout(() => {
            if(isTemp) {
                api.get("users/" + destinatorId).then((response) => {
                    const user = response.data;
                    setLabel(user.username);
                }); 
            }
            else {
                api.get("conversations/" + conversationId).then((response) => {
                    const item = response.data;
                    const name = item.isGroup ? item.name : item.participants.find(a => a.username != username)?.username;
                    setLabel(name);
                });
            }
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [isTemp, destinatorId, conversationId, delay]);

    useEffect(() => {
        if(isTemp) return;
        const timer = setTimeout(() => {
            api.get("messages/" + conversationId).then((response) => {
                setMessages(response.data);
            });
        }, delay);
         
        return () => {
            clearTimeout(timer);
        };
    }, [conversationId]);

    const sendMessage = async () => {
        const senderId = sessionStorage.getItem("id");
        const content = messageInputRef.current.value;
        //await api.get("users/");
        try {
            const response = await api.post("messages", {
                senderId: senderId,
                content: content,
                destinatorId: destinatorId,
                conversationId: conversationId
            });
            if(isTemp) navigate("/chat/" + response.data.conversationId);
        }
        catch(error) {
            alert(error.response.data);
        }
    }

    /*
    useEffect(() => {
        const id = sessionStorage.getItem("email");
        api.get("users/" + ).then((response) => {
            const user = response.data;
            setUser({
                username: user.username,
                profilePhoto: "/LGT.png"
            });
        });
        
    }, [user]);*/

    /*useEffect(() => {
        //await api.get("users/")
        api.get("/messages/" + conversationId)
        .then((response) => {
            setMessages(response.data);
        });
    }, [conversationId]);*/

    const children = [];

    for(let i = 0; i < messages.length; i++) {
        children.push(<Components.Message 
            timestamp={messages[i].createdAt}
            sender={messages[i].user.username}
            content={messages[i].content}
        />);
    }

    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/chats")} />
            <Components.Flexed className="header-title">
                {label}
                <span style={{
                    marginLeft: "var(--spacing-medium)",
                    fontSize: "var(--font-size-short)"
                }}>
                    {/* 12 miembros */}
                </span>
            </Components.Flexed>
            <Components.ButtonIcon icon="call" />
            <Components.ButtonIcon icon="location_on" />
            <Components.ButtonIcon icon="group_add" />
        </div>
        <div id="root-content" style={{
            flex: 1,
            position: "relative",
            overflow: "hidden",
            width: "100%",
            display: "flex",
            flexDirection: "column"
        }}>
            <section className="messages-area">
                {children}
            </section>

            <footer className="chat-input-area">
                <Components.ButtonIcon icon="add" darkgray/>
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <input
                        ref={messageInputRef}
                        type="text"
                        placeholder="Escribe un mensaje futbolero..."
                    />
                </div>
                <Components.ButtonIcon onClick={() => sendMessage()} icon="send" darkgray/>
            </footer>
        </div>
    </>);
};