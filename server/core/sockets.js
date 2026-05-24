import { User } from "#FifengerModels";
import { UserStatusEnum } from "#FifengerServer";
import { Socket } from "socket.io";

// ENVIAR MENSAJES
// RECIBIR MENSAJES
// {userId: "sdidsjijsd", content: "Hola"} 

const activeUsers = new Map();

/**
 * Establece los eventos de socket a un socket.
 * @param {Socket} socket 
 * @param {import("socket.io").Server} io
 */
export function setEventsToSocket(socket, io) {
    socket.on("user_connected", async (userId) => {
            socket.userId = userId

            if(!activeUsers.has(userId)){
                activeUsers.set(userId, new Set());
            }

            activeUsers.get(userId).add(socket.id);

            await User.findByIdAndUpdate(userId, {
                status: UserStatusEnum.ONLINE
            });


            if(activeUsers.get(userId).size === 1){
                socket.broadcast.emit("user_status_change", {userId, status: UserStatusEnum.ONLINE});
                console.log(userId + " is online.");
            }
        });
    
    socket.on("join_conversation", (data) => {
        const { conversationId } = data;
        if(!conversationId) return;
        socket.join(conversationId);
    });

    socket.on("leave_conversation", ({ conversationId }) => {
        if (!conversationId) return;
        socket.leave(conversationId);
        // console.log("Socket " + socket.id + " se fue de la sala: " + conversationId)
    });

    socket.on("user_disconnected", async () => {
        const userId = socket.userId;

        if(userId && activeUsers.has(userId)){
            const userSockets = activeUsers.get(userId);

            userSockets.delete(socket.id);

            if(userSockets.size === 0){
                activeUsers.delete(userId);

                await User.findByIdAndUpdate(userId, {
                    status: UserStatusEnum.OFFLINE
                })

                socket.broadcast.emit("user_status_change", {userId, status: "offline"});
                console.log(userId + " is now offline.");
            }
        }
        // console.log("User disconnected:", socket.id);
    });
}