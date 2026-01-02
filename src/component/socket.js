import { io } from "socket.io-client";

const socket = io("https://ruzzlebackend-production.up.railway.app", {
  autoConnect: true,
});

export default socket;
