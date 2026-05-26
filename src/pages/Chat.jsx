import { Components, Items, api, getLocationURL, preventDefault, socket } from "@/FifengerClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
// @ts-ignore
import "../css/Chat.css";

export default function Chat() {
    const { destinatorId, conversationId } = useParams();
    const delay = 0.15 * 1000;
    const [label, setLabel] = useState("Loading...");
    const [messages, setMessages] = useState([]);

    /**
     * @template {{title: string, content: string}} T 
     * @type {[T | null, Function]}
     */
    const [message, setMessage] = useState(null);

    /**
     * @template {{title: string, onConfirm: () => {}, placeholder1: string, placeholder2: string}} V 
     * @type {[V | null, Function]}
     */
    const [inputBox, setInputBox] = useState(null);

    const [cryptoIcon, setCryptoIcon] = useState("encrypted_off");
    const [isGroup, setIsGroup] = useState(false);
    const navigate = useNavigate();
    const didFetch = useRef(false);
    const inputAttachmentRef = useRef(null);
    const formRef = useRef(null);

    const isTemp = Boolean(destinatorId);

    /*
    const decryptMessage = (cipherText) => {
        try {
            const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return decrypted ? decrypted : cipherText;
        } catch (e) {
            return cipherText;
        }
    };
    */

    useEffect(() => {
        if (!conversationId) return;
        socket.emit("join_conversation", {
            conversationId: conversationId
        });

        return (() => {
            socket.emit("leave_conversation");
        })
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
                    setIsGroup(item.isGroup);
                    const name = item.isGroup ? item.name : item.participants.find(a => a.username != username)?.username;
                    setLabel(name);
                });
            }
            
        }, delay);
    });

    useEffect(() => {
        const handler = (message) => {
            setMessages((prev) => [
                message,
                ...prev,
            ]);
        };

        socket.on("message_create", handler);

        return () => {
            socket.off("message_create", handler);
        };
    }, []);

    useEffect(() => {
        if(didFetch.current || !conversationId) return;
        didFetch.current = true;
        const userId = sessionStorage.getItem("id");
        (async () => {
            try {
                const { data } = await api.get("/conversations/" + conversationId, {
                    withCredentials: true
                });
                setCryptoIcon(data.encryptionEnabled  ? "encrypted" : "encrypted_off");
                setIsGroup(data.isGroup);
                api.get("/messages/" + conversationId)
                .then(response => setMessages(response.data));
            }
            catch(error) {
                showErrors(error);
            }
        })();
    }, []);

    const showErrors = (error) => {
        setMessage({
            title: "Warning",
            content: error.response.data.errors
        });
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
            if(isTemp) {
                setTimeout(() => {  
                    navigate("/chats/" + response.data.conversationId);
                }, 500);
            }
        }
        catch(error) {
            showErrors(error);
        }
    }

    const onSendMessage = async () => {
        const data = new FormData(formRef.current);
        sendMessage(data);
    }

    const onSendMail = async () => {
        setInputBox({
            title: "Send Mail",
            placeholder1: "Your message",
            onConfirm: (content) => sendMail(content)
        });
    }

    const sendMail = async (content) => {
        if(!content || !content.trim()){
            setInputBox(null);
            setMessage({
                title: "Error",
                content: "The content cannot be empty."
            });
            return;
        }

        try{
            await api.post("/messages/send-email", {
                conversationId: conversationId,
                content: content
            })

            setInputBox(null);
            setMessage({
                title: "Success",
                content: "The mail message has been sent successfully."
            });
        }
        catch (error) {
            console.log(error);

            const backendError = error.response?.data?.error || "Error sending email.";

            setInputBox(null);
            setMessage({
                title: "Error",
                content: backendError
            });
        }
    }

    const onSendLocation = async () => {
        const locationURL = await getLocationURL();
        if(!locationURL) {
            setMessage({
                title: "Warning",
                content: "No se pudo obtener la ubicacion."
            });
            return;
        }
        const data = new FormData();
        data.set("content", locationURL);
        sendMessage(data);
    }

    const onGroupAdd = async () => {
        setInputBox({
            title: "Add",
            placeholder1: "User email",
            placeholder2: "Group name",
            onConfirm: (email, groupName) => {
                addUser(email, groupName);
            }
        });
    }

    const addUser = async (email, groupName) => {
        try {
            if(!email.trim()){
                setInputBox(null);
                setMessage({
                    title: "Error",
                    content: "Enter a valid email."
                });
                return;
            }

            if(conversationId && isGroup) {
                const { data: updatedGroup } = await api.patch("/conversations/" + conversationId + "/add-participant", {
                    email: email
                });

                window.location.reload();
                return;
            }

            const { data: group } = await api.post("/conversations/group", {
                name: groupName ? groupName : "Grupito",
                id: conversationId,
                email: email
            });

            navigate("/chats/" + group.id);
        }
        catch(error) {
            console.log(error.message);
            showErrors(error);
        }
    }

    const onSwitchEncryption = async () => {
        try {
            const url = "/conversations/" + conversationId + "/switch_encryption";
            const { data } = await api.patch(url, {}, {
                withCredentials: true
            });
            const isEnabled = data.encryptionEnabled;
            setCryptoIcon(isEnabled ? "encrypted" : "encrypted_off");
            setMessage({
                title: "Warning",
                content: "Encryption " + (isEnabled ? "enabled" : "disabled")
            });
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

    return (
    <>
        {message && (<Components.MessageBox 
            title={message.title} 
            content={message.content} 
            onConfirm={() => setMessage(null)}
        />)}

        {inputBox && (<Components.InputBox
            title={inputBox.title}
            onClose={() => setInputBox(null)}
            onConfirm={inputBox.onConfirm}
            placeholderOne={inputBox.placeholder1}
            placeholderTwo={inputBox.placeholder2}
        />)}

        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/chats")} />
            <Components.Flexed className="header-title">
                {label}
            </Components.Flexed>
            {(!isTemp) && <>
                <Components.ButtonIcon icon="group_add" onClick={onGroupAdd}/>
                <Components.ButtonIcon icon="forward_to_inbox" onClick={onSendMail}/>
            </>}
            
            {(!isGroup && isGroup !== null && !isTemp) && <Components.ButtonIcon 
                icon="call"
                onClick={() => navigate("/call/" + conversationId)}
            />}
            
            {(!isTemp) && 
                <Components.ButtonIcon icon={cryptoIcon}  onClick={onSwitchEncryption}/>}

            {/* 📋 BOTÓN PARA IR AL PANEL DE TAREAS (REQUISITO 4) */}
            
             {(!isGroup && isGroup !== null && !isTemp) && 
             <Components.ButtonIcon icon="assignment" onClick={() => navigate(`/chats/${conversationId}/tasks`)}/>
             }
            
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

            <form ref={formRef} className="chat-input-area" onSubmit={preventDefault}>
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
                        onKeyDown={(e) => e.key === 'Enter' && onSendMessage()}
                    />
                </div>
                <Components.ButtonIcon onClick={onSendMessage} icon="send" darkgray/>
            </form>
        </div>
    </>);
}
