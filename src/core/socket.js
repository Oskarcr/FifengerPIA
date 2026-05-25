import { io } from "socket.io-client";

export const socket = io("http://" + window.location.hostname + ":4000", {
    withCredentials: true
});

socket.on("connect", () => {
    const userId = sessionStorage.getItem("id");
    if(!userId) return;
    socket.emit("login", userId);
});