import { User } from "#FifengerModels";
import { UserStatus } from "#FifengerServer";
import { Socket } from "socket.io";

/**
 * @type {Map<string, string>}
 */
const activeUsers = new Map();

/**
 * Es un map... `Map<conversationId, userIds[]>`.
 * @type {Map<string, Set<string>>}
 */
const callcitas = new Map();

/**
 * Establece los eventos de socket a un socket.
 * @param {Socket} socket 
 * @param {import("socket.io").Server} io
 */
export function setEventsToSocket(socket, io) {
    /**@type {string} */
    let conversationId = null;
    /**@type {string} */
    let userId = null;

    /**
     * Emite un evento a todos los demas en la sala `conversationId`.
     * @param {string} eventName 
     * @param {any} data 
     */
    const emitOnCall = (eventName, data) => {
        if(!conversationId) return;
        const people = callcitas.get(conversationId);
        if (!people) return;

        for (const id of people) {
            if (id === userId) continue;
            const socketId = activeUsers.get(id);
            if (!socketId) continue;
            io.to(socketId).emit(eventName, data);
        }
    }

    const leaveCall = () => {
        if(!userId) return;
        if (!conversationId) return;

        const people = callcitas.get(conversationId);
        if (!people) return;

        people.delete(userId);
        
        if (people.size <= 0) callcitas.delete(conversationId);
        
        socket.leave(conversationId);
        conversationId = null;
        
        console.log("leaved to call: " + userId);
    }

    const disconnect = async () => {
        if(!userId) return;

        try {
            await User.findByIdAndUpdate(userId, {
                status: UserStatus.OFFLINE
            });
        }
        catch(_) {}
        
        activeUsers.delete(userId);
        socket.broadcast.emit("user_status_change", {
            userId: userId, 
            status: "offline"
        });
        
        console.log(userId + " is now offline.");

        leaveCall();

        userId = null;
        conversationId = null;
    }

    socket.on("login", async (id) => {
        userId = id;
        
        activeUsers.set(userId, socket.id);

        try {
            await User.findByIdAndUpdate(userId, {
                status: UserStatus.ONLINE
            });
        }
        catch(_) {}

        socket.broadcast.emit("user_status_change", {
            userId: userId, 
            status: UserStatus.ONLINE
        });

        console.log(userId + " is online.");
    });

    socket.on("join_call", (data) => {
        if(!userId) return;
        if(!data.conversationId) return;
        conversationId = data.conversationId;

        let people = callcitas.get(conversationId);

        if (!people) {
            people = new Set();
            callcitas.set(conversationId, people);
        }

        people.add(userId);
        socket.join(conversationId);

        console.log("joined to call: " + userId);

        if (people.size === 2) {
            socket.to(conversationId).emit("call_created"); 
        }
    });

    socket.on("leave_call", leaveCall);

    socket.on("rtc_offer", (data) => {
        emitOnCall("rtc_offer", data);
    });

    socket.on("rtc_answer", (data) => {
        emitOnCall("rtc_answer", data);
    });

    socket.on("ice_candidate", (data) => {
        emitOnCall("ice_candidate", data);
    });
    
    socket.on("join_conversation", (data) => {
        if(!userId) return;
        if(!data.conversationId) return;
        conversationId = data.conversationId;
        socket.join(conversationId);
    });

    socket.on("leave_conversation", () => {
        if(!userId) return;
        if (!conversationId) return;
        socket.leave(conversationId);
        conversationId = null;
    });

    socket.on("logout", disconnect);

    socket.on("disconnect", disconnect);
}