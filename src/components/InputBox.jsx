import { Spacing } from "@/FifengerClient";
import { useState } from "react";
import "../css/defaults.css";

export default function InputBox({ title = "", placeholder = "", isPassword = false, oneOption = false, onClose = () => { }, onConfirm = (value) => { } }) {
    const [value, setValue] = useState("");

    return (
        <div className="input-box">
            <div className="input-box-content">
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: Spacing.MD
                }}>
                    <div className="input-box-title">
                        {title}
                    </div>
                    <input className="input-box-field" type={isPassword ? "password" : "text"} placeholder={placeholder} value={value} onChange={(e) => setValue(e.target.value)} />

                    <div className="input-box-buttons" style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: Spacing.MD
                    }}>
                        <button className="message-button" onClick={onClose} style={{
                            flex: 1,
                            display: oneOption ? "none" : "block"
                        }}>
                            CANCELAR
                        </button>

                        <button className="message-button" onClick={() => onConfirm(value)} style={{
                            flex: 1,
                            marginInline: "auto"
                        }}>
                            CONFIRMAR
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}