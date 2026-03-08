import Icon from "./Icon";

export default function ButtonIcon({onClick=()=>{}, icon="view_cozy"}) {
    return (
        <button className="button-icon" onClick={() => onClick()}>
            <Icon name={icon}/>
        </button>
    );
}