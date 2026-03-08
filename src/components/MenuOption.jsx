import Icon from "./Icon";

export default function MenuOption({title="", label=""}) {
    return (<div className="menu-option">
        <div className="menu-option-title">{title}</div>
        <div className="menu-option-label">{label}</div>
        <Icon name="chevron_forward"/>
    </div>);
}