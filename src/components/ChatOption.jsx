// import defaultImg from "https://images.genius.com/04cabcd7cba7ee26de65fbcf5c67acd4.300x300x1.jpg";

export default function ChatOption({onClick=() => {}}) {
    return (
        <div className="chat-option" onClick={() => onClick()}>
            <div className="chat-option-image">
                <img src="https://images.genius.com/04cabcd7cba7ee26de65fbcf5c67acd4.300x300x1.jpg"/>
                <div className="chat-option-status"></div>
            </div>
            <div className="chat-option-username">Low</div>
        </div>
    );
}