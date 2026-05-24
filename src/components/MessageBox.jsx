import { Spacing } from "@/FifengerClient";
import "../css/defaults.css"

export default function MessageBox({ title, content, onConfirm}) {
    const contentHTML = (<>
        {content.split("\\n").map((a, i) => {
            return (i != 0 ? <><br/>{a}</> : <>{a}</>);
        })}
    </>);
    
    return (
        <div className="message-box">
            <div className="message-container">
                <div className="message-text-title">{title}</div>
                <div className="message-text-content" style={{padding: Spacing.LG}}>
                    {contentHTML}
                </div>
                <div className="message-button-container">
                    <button className="message-button" onClick={onConfirm}>Confirmar</button>
                </div>
            </div>
        </div>
    )
}