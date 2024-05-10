const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const { ACTIONS } = require('./Actions');
const path = require('path');
const env = require('dotenv');

env.config();

const app = express();

// Create a HTTP server using express instance
const server = http.createServer(app);

// Initialize Socket.IO server
const io = new Server(server);

// Mapping of socket IDs to usernames
const userSocketMap = {};

// Function to get all connected clients in a room
function getAllConnectedClients(roomId) {
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
        socketId,
        username: userSocketMap[socketId],
    }));
}

// Event handler for new client connection
io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Event handler for client joining a room
    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);

        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    // Event handler for code change broadcast
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    // Event handler for client disconnecting
    socket.on('disconnecting', () => {
        const rooms = Array.from(socket.rooms);
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
    });
});

// Listen on the environment-defined port
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server listening on port ${port}!`));


const __dirname1 = "/Users/Projects/WebD/CollegeProject/untitled folder/Code-n-Colab-main"

if (process.env.NODE_ENV === 'production') {
    // Serve static files from the 'client/dist' directory
    app.use(express.static(path.join(__dirname1, "client", "dist")));

    // For all other routes, serve the 'index.html' file
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname1, "client", "dist", "index.html"));
    });
} else {
    // For development, just send a message indicating that the API is running
    app.get("/", (req, res) => {
        res.send("API is running successfully");
    });
}
module.exports = server; // Export server for Vercel







