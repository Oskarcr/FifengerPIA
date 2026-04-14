import { Components } from "@/Fifenger";
import "../css/Chat.css";
import { useNavigate } from "react-router-dom";

export default function Chat() {
    const navigate = useNavigate();

    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/chat_list")} />
            <Components.Flexed className="header-title">
                Low
                <span style={{
                    marginLeft: "var(--padding-medium)",
                    fontSize: "var(--font-size-short)"
                }}>
                    12 miembros
                </span>
            </Components.Flexed>
            <Components.ButtonIcon icon="call" />
            <Components.ButtonIcon icon="location_on" />
            <Components.ButtonIcon icon="group_add" />
        </div>
        <div id="root-content" style={{
            flex: 1,
            display: "flex",
            flexDirection: "column"
        }}>
            <section className="messages-area">
                <Components.Message sender="Low" content="What's up, man? XD im LOW-TIER-GOD"/>
                <Components.Message sender="You" content="No hablo ingles amigo"/>
                <Components.Message sender="Low" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis cumque blanditiis alias doloribus illo nobis itaque facilis nemo? Officiis rerum nemo beatae vel. Odio possimus nostrum doloremque eum? Quasi, dolores."/>
            </section>

            <footer className="chat-input-area">
                <Components.ButtonIcon icon="add" darkgray/>
                <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center"
                }}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje futbolero..."
                    />
                </div>
                <Components.ButtonIcon icon="send" darkgray/>
            </footer>
        </div>
    </>);
};