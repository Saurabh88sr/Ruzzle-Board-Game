import { io } from "socket.io-client";

// Hardcode it temporarily to verify the connection
const URL = "https://ruzzle-backend.onrender.com"; 

const socket = io(URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

export default socket;