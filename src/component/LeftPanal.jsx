import React, { useEffect, useState } from "react";
import {  useSelector } from "react-redux";
import socket from "../socket";

const LeftPanal = () => {
  const { scoreValue } = useSelector(
    (state) => state.user
  );
  console.log("RighPanal scoreValue:", scoreValue);

  const [playersOnline, setPlayersOnline] = useState([]);
  const [update , setUpdate] = useState(false);


  // ✅ Online players
  useEffect(() => {
    const handlePlayers = (players) => {
      setPlayersOnline(players);
    };

    socket.on("online_players", handlePlayers);

    return () => socket.off("online_players", handlePlayers);
  }, []);


  const onceRoomJoined =(id)=>{
    socket.emit("create_room", { targetSocketId: id });
    console.log("Creating room with:", id);
    setUpdate(!update);    
  };

  // useEffect(() => {
  //   socket.on("room_joined", (data) => {
  //     // console.log("Joined room:", data.roomId);
  //     // save roomId in state or redux
  //   });
  //   console.log("useEffect room_joined called");

  //   return () => socket.off("room_joined");
  // }, [update]);




  return (
    <div className="w-full h-screen overflow-auto p-4 border-l">

      {/* ONLINE PLAYERS */}
      <div className="mt-4">
        <h3 className="font-bold">Players Online</h3>
        {playersOnline.map((p) => (
          <div key={p.socketId} 
          onClick={()=>onceRoomJoined(p.socketId)}
          // onClick={() => socket.emit("create_room", { targetSocketId: p.socketId },console.log("Creating room with:", p.socketId))} 
          className="bg-gray-100 p-2 mt-1 rounded cursor-pointer hover:bg-gray-200">
            {p.name}
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default LeftPanal;
