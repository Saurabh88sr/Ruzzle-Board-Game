import { io } from "socket.io-client";

const URL = process.env.NODE_ENV === "production" 
  ? "https://ruzzle-backend.onrender.com" 
  : "http://localhost:5000";

const socket = io(URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

export default socket;
