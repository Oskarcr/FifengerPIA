import { Components } from "@/FifengerClient";
import { useNavigate } from "react-router-dom";
import MENU_OPTIONS from "../json/menu_options.json";
import { useState } from "react";

export default function Menu() {
    const navigate = useNavigate();

    const onClicks = {
        "login": () => {
            sessionStorage.clear();
        }
    };

    let children = [];
    for(let i = 0; i < MENU_OPTIONS.length; i++) {
        const title = MENU_OPTIONS[i].title;
        const label = MENU_OPTIONS[i].label;
        const target = MENU_OPTIONS[i].target;
        const onClick = (target ? () => {
            const f = onClicks[target];
            if(typeof f === "function") f();
            navigate("/" + target);
        } : () => {});
        const element = <Components.MenuOption title={title} label={label} key={"menu_option_key_" + i} onClick={() => onClick()}/>
        children.push(element);
    }
    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/chats")}/>
            <Components.Flexed className="header-title">
                Menu
            </Components.Flexed>
        </div>
        <div id="root-content" style={{
            flexDirection: "column",
            gap: "var(--spacing-short)",
            padding: "var(--spacing-short)",
            alignItems: "center"
        }}>
            {children}
        </div>
    </>);
}