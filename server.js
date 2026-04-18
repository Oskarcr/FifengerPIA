import { app, setEventsToSocket } from "#FifengerServer";
import mongoose from "mongoose";
import http from "http";
import { Server as SocketServer } from "socket.io";

const port = process.env["SERVER_PORT"];
const url = process.env["DATABASE_URL"];

const server = http.createServer(app);

const io = new SocketServer(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

app.set("io", io);

async function start() {
    try {
        await mongoose.connect(url);
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

    server.listen(port, () => {
        console.log("App listeting on http://localhost:" + port);
    });
}

start();