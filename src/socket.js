import { io } from "socket.io-client";

// This ensures that if the env variable exists, it uses it; otherwise defaults to local
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(URL, {
  withCredentials: true,
  transports: ["polling", "websocket"],
});

export default socket;