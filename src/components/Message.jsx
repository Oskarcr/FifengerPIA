export default function Message({sender="", content="", time="08/03/2025 a las 22:09"}) {
    return(<div className="message received">
        <img src="https://images.genius.com/04cabcd7cba7ee26de65fbcf5c67acd4.300x300x1.jpg"/>
        <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        }}>
            <div className="message-info">
                <span className="message-sender">{sender}</span>
                <span className="message-time">{time}</span>
            </div>
            <p className="message-content">{content}</p>
        </div>
    </div>);
}