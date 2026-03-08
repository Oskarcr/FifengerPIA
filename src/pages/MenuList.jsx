import { useState } from "react";
import ButtonIcon from "../components/ButtonIcon";
import Flexed from "../components/Flexed";
import MenuOption from "../components/MenuOption";
import MENU_OPTIONS from "../json/menu_options.json";
import getPage from "../Routes";

export default function MenuList() {
    const PAGE_NAME = "menu_list";
    const [pageName, setPage] = useState(PAGE_NAME);
    if(pageName != PAGE_NAME) {
        return getPage(pageName);
    }

    let children = [];
    for(let i = 0; i < MENU_OPTIONS.length; i++) {
        const title = MENU_OPTIONS[i].title;
        const label = MENU_OPTIONS[i].label;
        const element = <MenuOption title={title} label={label} key={"menu_option_key_" + i}/>
        children.push(element);
    }
    return (<>
        <div id="header">
            <ButtonIcon icon="arrow_left_alt" onClick={() => setPage("chat_list")}/>
            <Flexed className="header-title">
                Menu
            </Flexed>
        </div>
        <div id="root-content" style={{
            flexDirection: "column",
            gap: "var(--padding-short)",
            padding: "var(--padding-short)",
            alignItems: "center"
        }}>
            {children}
        </div>
    </>);
}