import React, { useState } from 'react';
import "../css/Chat.css";
import ButtonIcon from '../components/ButtonIcon';
import Flexed from '../components/Flexed';
import getPage from '../Routes';
import Message from '../components/Message';

export default function Chat() {
    const PAGE_NAME = "chat";
    const [pageName, setPage] = useState(PAGE_NAME);
    if (pageName != PAGE_NAME) {
        return getPage(pageName);
    }

    return (<>
        <div id="header">
            <ButtonIcon icon="arrow_left_alt" onClick={() => setPage("chat_list")} />
            <Flexed className="header-title">
                Low
                <span style={{
                    marginLeft: "var(--padding-medium)",
                    fontSize: "var(--font-size-short)"
                }}>
                    12 miembros
                </span>
            </Flexed>
            <ButtonIcon icon="call" />
            <ButtonIcon icon="location_on" />
            <ButtonIcon icon="group_add" />
        </div>
        <div id="root-content" style={{
            flex: 1,
            display: "flex",
            flexDirection: "column"
        }}>
            <section className="messages-area">
                <Message sender="Low" content="What's up, man? XD im LOW-TIER-GOD"/>
                <Message sender="You" content="No hablo ingles amigo"/>
                <Message sender="Low" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis cumque blanditiis alias doloribus illo nobis itaque facilis nemo? Officiis rerum nemo beatae vel. Odio possimus nostrum doloremque eum? Quasi, dolores."/>
            </section>

            <footer className="chat-input-area">
                <ButtonIcon icon="add" darkgray/>
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
                <ButtonIcon icon="send" darkgray/>
            </footer>
        </div>
    </>);
};