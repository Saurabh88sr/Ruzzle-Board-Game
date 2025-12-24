import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPlayerName } from "../store/UserSlice";
import socket from "../socket";

const PlayerName = ({ setPopupForm }) => {
  const dispatch = useDispatch();
  const [playerNo, setPlayerNo] = useState(1);

  const onsubmit = (e) => {
    e.preventDefault();

    const name = e.target.name.value.trim();
    if (!name) return;

    const playerData = {
      id: Math.random().toString(36).substring(2, 9),
      name,
    };

    // ✅ Emit join
    socket.emit("join", playerData);

    // optional redux
    dispatch(setPlayerName({ ...playerData, player: playerNo }));

    setPlayerNo((p) => p + 1);
    setPopupForm(false);
    e.target.reset();
  };

  return (
    <div className="absolute w-full bg-black/50 h-screen">
      <div className="absolute left-1/2 top-4 bg-white p-5 rounded-2xl -translate-x-1/2">
        <h3>Enter Player Name</h3>

        <form onSubmit={onsubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="border p-2 rounded"
          />
          <button className="bg-blue-500 text-white p-2 rounded ml-2">
            Join
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlayerName;
