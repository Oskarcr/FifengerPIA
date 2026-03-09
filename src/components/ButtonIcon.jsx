import Icon from "./Icon";

export default function ButtonIcon({onClick=()=>{}, icon="view_cozy", darkgray=false}) {
    return (
        <button className="button-icon" onClick={() => onClick()} color={(darkgray ? "darkgray" : "dark")}>
            <Icon name={icon}/>
        </button>
    );
}