import { Components } from "@/Fifenger";
import { useNavigate } from "react-router-dom";
import MENU_OPTIONS from "../json/menu_options.json";

export default function Menu() {
    const navigate = useNavigate();

    let children = [];
    for(let i = 0; i < MENU_OPTIONS.length; i++) {
        const title = MENU_OPTIONS[i].title;
        const label = MENU_OPTIONS[i].label;
        const target = MENU_OPTIONS[i].target;
        const onClick = (target ? () => (navigate("/" + target)) : () => {});
        const element = <Components.MenuOption title={title} label={label} key={"menu_option_key_" + i} onClick={() => onClick()}/>
        children.push(element);
    }
    return (<>
        <div id="header">
            <Components.ButtonIcon icon="arrow_left_alt" onClick={() => navigate("/chat_list")}/>
            <Components.Flexed className="header-title">
                Menu
            </Components.Flexed>
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