export default function ChatOption({onClick=() => {}}) {
    return (
        <div className="chat-option" onClick={() => onClick()}>
            <div className="chat-option-image">
                <img src="./LTG.jpg"/>
                <div className="chat-option-status"></div>
            </div>
            <div className="chat-option-username">Low</div>
        </div>
    );
}