const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const players = {};
const rooms = {};

io.on("connection", (socket) => {
  console.log("Player Connected:", socket.id);

  socket.on("join", (playerData) => {
    const player = {
      socketId: socket.id,
      id: playerData.id,
      name: playerData.name,
      joinedAt: new Date().toISOString(),
    };

    players[socket.id] = player;


    socket.emit("my_profile", player); // ✅ only THIS browser

    // 🔹 2. Notify OTHER players
    socket.broadcast.emit("join_player", player);

    // 🔹 3. Send updated online players list to EVERYONE
    io.emit("online_players", Object.values(players));
  });

    socket.on("create_room", ({ targetSocketId }) => {
      // console.log(`Create room request from ${socket.id} to ${targetSocketId}`);
      console.log("Current rooms");
    const fromPlayer = socket.id;
    const toPlayer = targetSocketId;

    if (!fromPlayer || !toPlayer) return;

    // prevent self-join
    if (socket.id === targetSocketId) return;
    

    // create room id
    const roomId = `room_${socket.id}_${targetSocketId}`;
    console.log("Generated Room ID:", roomId);
    // save room
    rooms[roomId] = {
      players: [socket.id, targetSocketId],
    };

    if (rooms[roomId].players.length > 2) return;

    // join both sockets
    socket.join(roomId);
    io.to(targetSocketId).socketsJoin(roomId);

    // notify both players
    io.to(roomId).emit("room_joined", {
      roomId,
      players: [
        { socketId: fromPlayer, self: true },
        { socketId: toPlayer, self: false }
      ],
    });

    console.log("Room created:", roomId);
  });


  // DISCONNECT
  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("players", Object.values(players));
  });

  socket.on("send_request", (toSocketId) => {
    io.to(toSocketId).emit("game_request", {
      from: socket.id,
      name: players[socket.id].name,
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
