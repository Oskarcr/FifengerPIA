import { Navigate, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { api } from "@/FifengerClient";
import MessageBox from "../components/MessageBox.jsx";

export default function Login() {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const logged = sessionStorage.getItem("id");
    if (logged) return <Navigate to={"/chats"} />;

    const login = async (evt) => {
        evt.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await api.post("/auth/login", data);
            sessionStorage.setItem("username", response.data.username);
            sessionStorage.setItem("email", response.data.email);
            sessionStorage.setItem("id", response.data.id);
            navigate("/chats");
        }
        catch (error) {
            console.log(error);

            const data = error.response.data;

            setTitle("Error");

            if (data.message) {
                setMessage(data.message);
            }

            if(data.empties) {
                setMessage(data.empties.join("\\n"));
            }

            if(data.errors){
                setMessage("The fields are missing:\\n" + data.errors.join("\\n"));
            }
            setShowMessage(true);
        }
    }

    return (
        <>
            {showMessage && (
                <MessageBox title={title} content={message} onConfirm={() => {
                    setShowMessage(false)
                }}/>
            )}

            <div id="container-wrapper">
                <div id="card-container">
                    <form id="card" ref={formRef}>
                        <div id="login-title">Login in to Fifenger</div>
                        <input id="login-email" name="email" type="email" placeholder="Email"></input>
                        <input id="login-password" name="password" type="password" placeholder="Password"></input>
                        <span id="login-account" onClick={() => navigate("/signup")}>Don't you have account?</span>
                        <button id="login-button" type="submit" onClick={login}>Login</button>
                    </form>
                </div>
            </div>
        </>
    )
}