import { Socket } from "socket.io";

// ENVIAR MENSAJES
// RECIBIR MENSAJES
// {userId: "sdidsjijsd", content: "Hola"} 

/**
 * Establece los eventos de socket a un socket.
 * @param {Socket} socket 
 * @param {Server} io
 */
export function setEventsToSocket(socket, io) {
    socket.on("join_conversation", (data) => {
        const { conversationId } = data;
        if(!conversationId) return;
        socket.join(conversationId);
        // console.log("Socket " + socket.id + " unido a la sala: " + conversationId);
    });

    socket.on("leave_conversation", ({ conversationId }) => {
        if (!conversationId) return;
        socket.leave(conversationId);
        // console.log("Socket " + socket.id + " se fue de la sala: " + conversationId)
    });

    socket.on("disconnect", () => {
        // console.log("User disconnected:", socket.id);
    });
}