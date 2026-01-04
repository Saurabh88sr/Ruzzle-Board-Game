import { io } from "socket.io-client";

// No if/else logic—just force the live URL
const socket = io("https://ruzzle-backend.onrender.com", {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

export default socket;