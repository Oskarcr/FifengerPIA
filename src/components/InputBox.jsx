import { Spacing } from "@/FifengerClient";
import { useState } from "react";
import "../css/defaults.css";

export default function InputBox({ title = "", placeholderOne = "", placeholderTwo = "", isPassword = false, oneOption = false, onClose = () => { }, onConfirm = (valueOne, valueTwo) => { }, doubleField = false}) {
    const [valueOne, setValueOne] = useState("");
    const [valueTwo, setValueTwo] = useState("");

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
                    <input className="input-box-field" type={isPassword ? "password" : "text"}
                    placeholder={placeholderOne} value={valueOne} onChange={(e) => setValueOne(e.target.value)} />

                    <input className="input-box-field" type={isPassword ? "password" : "text"}
                    placeholder={placeholderTwo} value={valueTwo} onChange={(e) => setValueTwo(e.target.value)} style={{
                        display: doubleField ? "block" : "none"
                    }}/>

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

                        <button className="message-button" onClick={() => {
                            if(doubleField){
                                onConfirm(valueOne, valueTwo);
                            }
                            else{
                                onConfirm(valueOne);
                            }
                        }
                        } style={{
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