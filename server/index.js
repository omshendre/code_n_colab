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

module.exports = server; // Export server for Vercel
