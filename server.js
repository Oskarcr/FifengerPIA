import { app, setEventsToSocket } from "#FifengerServer";
import { connect } from "mongoose";
import http from "http";
import { Server as SocketServer } from "socket.io";

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
        await connect(DATABASE_URL);
        console.log("Database connected sucessfully");
    }
    catch(err) {
        console.log("Could not connect to the database");
        console.error(err); 
        process.exit(0);
    }

    io.on("connection", (socket) => {
        console.log("connection!");
        setEventsToSocket(socket, io);
    });

    server.listen(PORT, "0.0.0.0", () => {
        console.log("App listeting on http://localhost:" + PORT);
    });
}

start();