import { io } from "socket.io-client";

export const socket = io("http://" + window.location.hostname + ":4000", {
    withCredentials: true
});