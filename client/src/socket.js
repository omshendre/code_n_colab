import { io } from "socket.io-client";

export const initSocket = async () => {
  // Define connection options
  const options = {
    "force new connection": true,
    reconnectionAttempts: Infinity, // Allow infinite reconnection attempts
    timeout: 10000, // Connection timeout of 10 seconds
    transports: ["websocket"], // Use WebSocket transport only
  };

  // Get the backend URL from the environment variable
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  // Create and return a new socket connection
  return io(backendUrl, options);
};
