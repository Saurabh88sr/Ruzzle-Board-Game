import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setPlayerName } from "../store/UserSlice";
import socket from "../socket";

const PlayerName = ({ setPopupForm }) => {
  const dispatch = useDispatch();
  const [playerNo, setPlayerNo] = useState(1);
  const [showPopup, setShowPopup] = useState(true);


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
    setShowPopup(false);
    e.target.reset();
  };

  return (
    <div
      className={`
    fixed inset-0 z-50
    flex items-start justify-center
    bg-black/50
    transition-opacity duration-300
    ${showPopup ? "opacity-100" : "opacity-0 pointer-events-none"}
  `}
    >
      <div
        className={`
      mt-20
      bg-white dark:bg-slate-800
      text-black dark:text-white
      p-6 rounded-2xl shadow-2xl
      w-[90%] max-w-sm

      transform transition-all duration-300 ease-out
      ${showPopup
            ? "scale-100 translate-y-0 opacity-100"
            : "scale-95 -translate-y-4 opacity-0"}
    `}
      >
        <h3 className="text-lg font-bold mb-4 text-center">
          🎮 Enter Player Name
        </h3>

        <form onSubmit={onsubmit} className="flex flex-col gap-2">
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="
          flex-1
          border border-slate-300
          p-2 rounded-lg
          bg-white text-black
          focus:outline-none focus:ring-2 focus:ring-blue-500

          dark:bg-slate-900 dark:text-white
          dark:border-slate-600
        "
          />

          <button
            className="
          bg-blue-500 text-white
          px-4 py-2 rounded-lg font-semibold
          hover:bg-blue-600 transition
        "
          >
            Join
          </button>
        </form>
      </div>
    </div>

  );
};

export default PlayerName;
