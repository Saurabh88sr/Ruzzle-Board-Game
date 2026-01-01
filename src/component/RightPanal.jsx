import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";
import { setSelectedCells, setCurrentPlayerIndex } from "../store/UserSlice";
import { Link } from "react-router";
import { Gamepad2 } from "lucide-react";

const RightPanal = ({ playername }) => {
  const dispatch = useDispatch();
  const { selectedCells, currentPlayerIndex, roomId } = useSelector(
    (state) => state.user
  );
  // console.log("RighPanal scoreValue:", scoreValue);
  const [myProfile, setMyProfile] = useState(null);
  const EMOJIS = ["😀", "😂", "🔥", "😮", "😡", "👏", "💀"];
  const [reactions, setReactions] = useState([]);

  console.log("reactions", reactions)


  useEffect(() => {
    const handleProfile = (data) => {
      setMyProfile((prev) => prev ?? data);
    };

    socket.on("my_profile", handleProfile);

    return () => socket.off("my_profile", handleProfile);
  }, []);


  // SPELL LOGIC (unchanged)
  const filteredCells = selectedCells.filter(
    (cell) => cell.playerId === playername?.id
  );

  const spell = filteredCells.map((c) => c.valuetext).join("");

  const checkspell = () => {
    dispatch(setSelectedCells([]));
    dispatch(setCurrentPlayerIndex(currentPlayerIndex === 0 ? 1 : 0));
  };

  // for use reaction 
  const sendReaction = (emoji) => {
    socket.emit("send_reaction", {
      roomId,
      emoji,
    });
  };


  useEffect(() => {
    const handleReaction = (reaction) => {
      // add reaction
      setReactions((prev) => [...prev, reaction]);

      // remove only THIS reaction after 3 seconds
      setTimeout(() => {
        setReactions((prev) =>
          prev.filter((r) => r.id !== reaction.id)
        );
      }, 3000);
    };

    socket.on("reaction", handleReaction);

    return () => socket.off("reaction", handleReaction);
  }, []);




  return (
    <div
      className="
    w-full md:h-screen overflow-auto p-4 rounded-xl shadow-2xl space-y-6
          bg-yellow-400 text-black

          dark:bg-linear-to-br
          dark:from-slate-900 dark:via-slate-800 dark:to-black
          dark:text-white

          transition-colors duration-300
  "
    >

      <div className="">
        <Link to="/">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">

              <Gamepad2 className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-black to-slate-400">
              DinoSaur
            </span>
          </div>

        </Link>
      </div>

      {/* PROFILE */}
      <div
        className="
      bg-blue-500 text-white
      dark:bg-slate-800
      p-4 rounded-xl shadow-lg
      border border-blue-600 dark:border-slate-700
    "
      >
        {myProfile ? (
          <>
            <p className="font-semibold">
              👤 <span className="font-normal">{myProfile.name}</span>
            </p>
          </>
        ) : (
          <p className="animate-pulse opacity-80">
            Loading profile...
          </p>
        )}
      </div>

      <div className="bg-white p-2 rounded-2xl">
        <div className="flex gap-2 justify-center">
          {EMOJIS.map((emoji) => (
            <button key={emoji} onClick={() => sendReaction(emoji)} className="text-2xl hover:scale-125 hover:drop-shadow-lg transition">
              {emoji}
            </button>
          ))}

        </div>
        <div className="md:relative">
          <div className="absolute md:top-20 top:1/4 left-1/2 -translate-x-1/2 pointer-events-none">
            {reactions.map((r, index) => (
              <div
                key={index}
                className="text-7xl animate-bounce"
              >
                {r.emoji}
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>

  );
};

export default RightPanal;
