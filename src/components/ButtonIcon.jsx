import Icon from "./Icon";

export default function ButtonIcon({icon="view_cozy"}) {
    return (
        <button className="button-icon">
            <Icon name={icon}/>
        </button>
    );
}