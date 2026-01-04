import { io } from "socket.io-client";

const socket = io("https://ruzzle-backend.onrender.com/ ", {
  autoConnect: true,
});

export default socket;
