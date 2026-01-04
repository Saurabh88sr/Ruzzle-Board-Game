import { io } from "socket.io-client";

const socket = io("https://ruzzle-backend.onrender.com", {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

export default socket;
