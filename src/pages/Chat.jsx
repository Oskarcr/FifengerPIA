import { Components, Items, api, getLocationURL, socket } from "@/FifengerClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js"; // <-- 1. IMPORTAMOS LA LIBRERÍA
// @ts-ignore
import "../css/Chat.css";


export default function Chat() {
    const delay = 0.15 * 1000;
    const { destinatorId, conversationId } = useParams();
    const [label, setLabel] = useState("Loading...");
    const [messages, setMessages] = useState([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [placeholderOne, setPlaceholderOne] = useState("");
    const [placeholderTwo, setPlaceholderTwo] = useState("");
    const [isGroup, setIsGroup] = useState(false);
    const [showMessageBox , setShowMessageBox] = useState(false);
    const [showInputBox, setShowInputBox] = useState(false);
    const [doubleField, setDoubleField] = useState(false);
    const navigate = useNavigate();
    const didFetch = useRef(false);
    const inputAttachmentRef = useRef(null);
    const formRef = useRef(null);
    const [confirmAction, setConfirmAction] = useState(() => () => {});

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
            setMessages((prev) => [{
                ...message,
                content: message.content,//decryptMessage(message.content), 
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
                api.get("messages/" + conversationId)
                .then(res => {
                    // Mapeamos los mensajes que vienen de la base de datos y los desencriptamos todos
                    const decryptedMessages = res.data.map(message => ({
                        ...message,
                        //content: decryptMessage(msg.content)
                    }));
                    setMessages(decryptedMessages);
                });
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
        if(data.has("content")) {
            //const encryptedContent = CryptoJS.AES.encrypt(data.get("content"), SECRET_KEY).toString();
            //data.set("content", encryptedContent);
        }
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

    const onSendMail = async () => {
        setTitle("Send Mail");
        setDoubleField(false);
        setPlaceholderOne("Your message");
        setConfirmAction(() => (content) => sendMail(content));
        setShowInputBox(true);
    }

    const sendMail = async (content) => {
        if(!content || !content.trim()){
            setShowInputBox(false);
            setTitle("Error");
            setMessage("The content cannot be empty.")
            setShowMessageBox(true);
            return;
        }

        try{
            await api.post("/messages/send-email", {
                conversationId: conversationId,
                content: content
            })

            setShowInputBox(false);
            setTitle("Success");
            setMessage("The mail message has been sent successfully.");
            setShowMessageBox(true);
        }
        catch (error) {
            console.log(error);

            setShowInputBox(false);

            setTitle("Error");

            const backendError = error.response?.data?.error || "Error sending email.";
            setMessage(backendError);

            setShowMessageBox(true);
        }
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
        setTitle("Add");
        setDoubleField(true);
        setPlaceholderOne("User email");
        setPlaceholderTwo("Group name");
        setConfirmAction(() => (email, groupName) => addUser(email, groupName));
        setShowInputBox(true);
    }

    const addUser = async (email, groupName) => {
        try {
            if(!email.trim()){
                setTitle("Error");
                setMessage("Enter a valid email.");
                setShowInputBox(false);
                setShowMessageBox(true);
                return;
            }

            console.log(groupName);

            if(conversationId && isGroup) {
                const { data: updatedGroup } = await api.patch("/conversations/" + conversationId + "/add-participant", {
                    email: email
                });

                setShowInputBox(false);
                console.log("usuario agregado");
                window.location.reload();
                return;
            }

            const { data: group } = await api.post("/conversations/group", {
                name: groupName ? groupName : "Grupito",
                id: conversationId,
                email: email
            });
            navigate("/chats");
        }
        catch(error) {
            console.log(error.message);

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
        {showMessageBox && (
            <Components.MessageBox title={title} content={message} onConfirm={() => setShowMessageBox(false)}/>
        )}

        {showInputBox && (
            <Components.InputBox doubleField={doubleField} title={title} onClose={() => setShowInputBox(false)}
                    onConfirm={confirmAction}
            placeholderOne={placeholderOne} placeholderTwo={placeholderTwo}>
            </Components.InputBox>
        )}

        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/chats")} />
            <Components.Flexed className="header-title">
                {label}
                <span style={{
                    marginLeft: "var(--spacing-medium)",
                    fontSize: "var(--font-size-short)"
                }}>
                </span>
            </Components.Flexed>
            <Components.ButtonIcon icon="forward_to_inbox" onClick={onSendMail}/>
            <Components.ButtonIcon icon="call" onClick={() => navigate("/video_call")}/>
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
                        placeholder="Escribe un mensaje encriptado..."
                        onKeyDown={(e) => e.key === 'Enter' && onSendMessage()} // Para enviar con Enter directo
                    />
                </div>
                <Components.ButtonIcon onClick={onSendMessage} icon="send" darkgray/>
            </form>
        </div>
    </>
    );
};