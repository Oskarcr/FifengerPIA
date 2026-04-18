import "../css/defaults.css"

export default function MessageBox({ title, content, onConfirm}) {
    return (
        <div className="message-box">
            <div className="message-container">
                <div className="message-text-title">{title}</div>
                <div className="message-text-content">
                    {content}
                </div>
                <div className="message-button-container">
                    <button className="message-button" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    )
}