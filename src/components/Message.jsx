export default function Message({sender="", content="", timestamp = Date.now()}) {
    
    const date = new Date(timestamp);
    const time = date.toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).replace(",", " at");

    return(<div className="message received">
        <img src="/LTG.jpg"/>
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