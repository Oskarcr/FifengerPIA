import { Components, api, getLocationURL, socket } from "@/FifengerClient";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CryptoJS from "crypto-js"; // <-- 1. IMPORTAMOS LA LIBRERÍA

// @ts-ignore
import "../css/Chat.css";

// <-- 2. DEFINIMOS UNA CLAVE SECRETA (Debe ser la misma para Óscar y para ti)
const SECRET_KEY = "ClaveSecretaMiddleware123";

export default function Chat() {
    const delay = 0.15 * 1000;
    /**@type {import("react").RefObject<HTMLInputElement>} */
    const messageInputRef = useRef(null);
    const { destinatorId, conversationId } = useParams();
    const [label, setLabel] = useState("Loading...");
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    const isTemp = !!destinatorId;

    // Función auxiliar para desencriptar de forma segura sin romper la app si el texto no está cifrado
   const decryptMessage = (cipherText) => {
        // !!! AQUÍ MERITO VA LA LÍNEA !!!
        console.log("Mensaje original encriptado desde la BD o Socket:", cipherText);

        try {
            const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            return decrypted ? decrypted : cipherText;
        } catch (e) {
            return cipherText;
        }
    };

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

        return () => {
            clearTimeout(timer);
        };
    }, [isTemp, destinatorId, conversationId, delay]);

    // <-- 3. DESENCRIPTAR AL RECIBIR MENSAJES EN TIEMPO REAL (SOCKETS)
    useEffect(() => {
        const handler = (message) => {
            setMessages((prev) => [{
                ...message,
                content: decryptMessage(message.content), // Desencriptamos el contenido que llega
                user: {
                    username: message.username
                }
            }, ...prev]);
        };

        socket.on("message_create", handler);

        return () => {
            socket.off("message_create", handler);
        };
    }, []);

    // <-- 4. DESENCRIPTAR AL CARGAR EL HISTORIAL (API GET)
    useEffect(() => {
        if(isTemp) return;
        if (!conversationId) return;

        let cancelable = true;

        const timer = setTimeout(async () => {
            cancelable = false;

            api.get("messages/" + conversationId)
            .then(res => {
                // Mapeamos los mensajes que vienen de la base de datos y los desencriptamos todos
                const decryptedMessages = res.data.map(msg => ({
                    ...msg,
                    content: decryptMessage(msg.content)
                }));
                setMessages(decryptedMessages);
            });
            
        }, delay);
         
        return () => {
            if(cancelable) clearTimeout(timer);
        };
    }, [conversationId]);

    const showErrors = (error) => {
        alert(error.response.data.errors);
    }

    /**
     * Envia un mensaje al chat.
     * @param {string} content 
     */
    // <-- 5. ENCRIPTAR ANTES DE ENVIAR (API POST)
    const sendMessage = async (content) => {
        const senderId = sessionStorage.getItem("id");
        
        // Aquí se encripta el mensaje
        const encryptedContent = CryptoJS.AES.encrypt(content, SECRET_KEY).toString();

        // 📸 ¡PON LA LÍNEA AQUÍ MERITO!
        console.log("TEXTO ENCRIPTADO LISTO PARA ENVIAR A LA CAPA INTERMEDIA:", encryptedContent);

        try {
            const response = await api.post("messages", {
                senderId: senderId,
                content: encryptedContent, 
                destinatorId: destinatorId,
                conversationId: conversationId
            });
            if(isTemp) navigate("/chat/" + response.data.conversationId);
        }
        catch(error) {
            showErrors(error);
        }
    }

    const onSendMessage = async () => {
        const content = messageInputRef.current.value;
        if (!content.trim()) return; // Validamos que no envíe vacíos
        messageInputRef.current.value = "";
        sendMessage(content);
    }

    const onSendLocation = async () => {
        const locationURL = await getLocationURL();
        if(!locationURL) {
            alert("No se pudo obtener la ubicacion.");
            return;
        }
        sendMessage(locationURL);
    }

    const onGroupAdd = async () => {
        const senderId = sessionStorage.getItem("id");
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
        children.push(<Components.Message 
            key={messages[i].id || i} // Buena práctica añadir una key en React
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
                </span>
            </Components.Flexed>
            <Components.ButtonIcon icon="call"  onClick={() => navigate("/video_call")}/>
            <Components.ButtonIcon icon="location_on" onClick={onSendLocation}/>
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
                        placeholder="Escribe un mensaje encriptado..."
                        onKeyDown={(e) => e.key === 'Enter' && onSendMessage()} // Para enviar con Enter directo
                    />
                </div>
                <Components.ButtonIcon onClick={onSendMessage} icon="send" darkgray/>
            </footer>
        </div>
    </>);
};