import { Components, Items, api, getLocationURL, socket } from "@/FifengerClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// @ts-ignore
import "../css/Chat.css";

export default function Chat() {
    const delay = 0.15 * 1000;
    /**@type {import("react").RefObject<HTMLInputElement>} */
    const messageInputRef = useRef(null);
    const { destinatorId, conversationId } = useParams();
    const [label, setLabel] = useState("Loading...");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const didFetch = useRef(false);
    const inputAttachmentRef = useRef(null);
    const formRef = useRef(null);

    const isTemp = Boolean(destinatorId);

    useEffect(() => {
        if (!conversationId) return;
        socket.emit("join_conversation", {
            conversationId: conversationId
        });
    }, [conversationId]);

    useEffect(() => {
        let cancelable = true;

        const username = sessionStorage.getItem("username");
        
        const timer = setTimeout(() => {
            cancelable = false;
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
    });

    useEffect(() => {
        const handler = (message) => {
            setMessages((prev) => [{
                ...message
            }, ...prev]);
        };

        socket.on("message_create", handler);

        return () => {
            socket.off("message_create", handler);
        };
    }, []);

    useEffect(() => {
        if(didFetch.current || !conversationId) return;
        didFetch.current = true;

        (async () => {
            try {
                const { data } = await api.get("/messages/" + conversationId);
                setMessages(data);
            }
            catch(_) {}
        })();
    }, []);

    const showErrors = (error) => {
        alert(error.response.data.errors);
    }

    /**
     * Envia un mensaje al chat.
     * @param {FormData} data 
     */
    const sendMessage = async (data) => {
        const senderId = sessionStorage.getItem("id");
        data.set("senderId", senderId);
        if(destinatorId) data.set("destinatorId", destinatorId);
        if(conversationId) data.set("conversationId", conversationId);

        try {
            formRef.current.reset();
            const response = await api.post("/messages", data);
            if(isTemp) navigate("/chat/" + response.data.conversationId);
        }
        catch(error) {
            showErrors(error);
        }
    }

    const onSendMessage = async () => {
        const data = new FormData(formRef.current);
        sendMessage(data);
    }

    const onSendLocation = async () => {
        const locationURL = await getLocationURL();
        if(!locationURL) {
            alert("No se pudo obtener la ubicacion.");
            return;
        }
        const data = new FormData();
        data.set("content", locationURL);
        sendMessage(data);
    }

    const onGroupAdd = async () => {
        try {
            const { data: group } = await api.post("/conversations/group", {
                name : "Grupito",
                conversationId: conversationId
            });
            navigate("/chats/" + group.id);
        }
        catch(error) {
            showErrors(error);
        }
    }

    const children = [];

    for(let i = 0; i < messages.length; i++) {
        const photoUrl = Items.get(messages[i].user.photoId).url;
        children.push(<Components.Message 
            timestamp={messages[i].createdAt}
            sender={messages[i].user.username}
            content={messages[i].content}
            attachmentUrl={messages[i].attachmentUrl}
            photoUrl={"/rewards/" + photoUrl}
            onClickUsername={() => navigate("/profiles/" + messages[i].user.id)}
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
            <Components.ButtonIcon icon="call"  onClick={() => navigate("/video_call")}/>
            <Components.ButtonIcon icon="group_add" onClick={onGroupAdd}/>
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

            <form ref={formRef} className="chat-input-area">
                <Components.ButtonIcon 
                    icon="add" 
                    darkgray 
                    onClick={() => inputAttachmentRef.current.click()}
                />
                <Components.ButtonIcon 
                    icon="location_on" 
                    darkgray 
                    onClick={onSendLocation}
                />
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <input 
                        ref={inputAttachmentRef}
                        name="attachment" 
                        type="file" 
                        accept="image/*"
                        style={{display: "none"}}
                    />
                    <input
                        name="content"
                        type="text"
                        placeholder="Escribe un mensaje futbolero..."
                    />
                </div>
                <Components.ButtonIcon onClick={onSendMessage} icon="send" darkgray/>
            </form>
        </div>
    </>);
};