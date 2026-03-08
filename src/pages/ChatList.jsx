import ButtonIcon from "../components/ButtonIcon";
import ChatOption from "../components/ChatOption";

export default function ChatList() {
    return (<>
        <div id="header">
            <ButtonIcon icon="menu"/>
            <input type="text"/>   
            <ButtonIcon icon="search"/>
        </div>
        <div id="root-content" style={{
            flexDirection: "column",
            gap: "var(--padding-short)",
            padding: "var(--padding-short)",
            alignItems: "center"
        }}>
            <ChatOption/>
            <ChatOption/>
            <ChatOption/>
        </div>
    </>);
}