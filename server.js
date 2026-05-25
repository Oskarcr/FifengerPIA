import { app, setEventsToSocket, UserStatus } from "#FifengerServer";
import mongoose from "mongoose"
import http from "http";
import { Server as SocketServer } from "socket.io";
import { User } from "#FifengerModels";

const PORT = parseInt(process.env["SERVER_PORT"]);
const DATABASE_URL = process.env["DATABASE_URL"];

const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: true,
        credentials: true
    }
});

app.set("io", io);

async function start() {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("Database connected sucessfully");
    }
    catch(err) {
        console.log("Could not connect to the database");
        console.error(err); 
        process.exit(0);
    }

    const shutdown = async () => {
        // Cerrar el socket.
        io.close();
        
        // Actualizar los estados a offline segun corresponda.
        try {
            await User.updateMany({
                status: UserStatus.ONLINE
            },{
                status: UserStatus.OFFLINE
            });
        }
        catch(_) {}

        // Cerrar el servidor.
        server.close(async () => {
            await mongoose.connection.close();
            process.exit(0);
        });
    }

    io.on("connection", (socket) => {
        setEventsToSocket(socket, io);
    });

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    server.listen(PORT, "0.0.0.0", () => {
        console.log("App listeting on http://localhost:" + PORT);
    });
}

start();