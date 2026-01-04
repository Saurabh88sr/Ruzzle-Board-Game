import { io } from "socket.io-client";


const socket = io("https://ruzzle-backend.onrender.com", {

  transports: ["polling", "websocket"],
});

// const socket = io("http://localhost:5000", {
//   withCredentials: true,
//   transports: ["polling", "websocket"],
// });

export default socket;