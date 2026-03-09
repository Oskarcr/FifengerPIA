import { useState } from "react";
import ButtonIcon from "../components/ButtonIcon";
import ChatOption from "../components/ChatOption";
import getPage from "../Routes";
import Flexed from "../components/Flexed";

export default function ChatList() {
    const PAGE_NAME = "chat_list";
    const [pageName, setPage] = useState(PAGE_NAME);
    if(pageName != PAGE_NAME) {
        return getPage(pageName);
    }
    return (<>
        <div id="header">
            <ButtonIcon icon="menu" onClick={() => setPage("menu_list")}/>
            <div className="header-search-container">
                <input type="text" placeholder="Search user by username"/>   
                <ButtonIcon icon="search"/>
            </div>
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