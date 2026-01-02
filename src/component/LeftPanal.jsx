import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";
import { setRoomId, setLasrtMove, setMoves } from "../store/UserSlice";
import GameButton from "./GameButton";

const LeftPanel = () => {
  const dispatch = useDispatch();
  const { roomId, moves } = useSelector((state) => state.user);

  const [playersOnline, setPlayersOnline] = useState([]);
  // const [moves, setMoves] = useState([]);
  const [totals, setTotals] = useState({});
  const [requestAccepted, setRequestAccepted] = useState(null);

  /* ---------------- ONLINE PLAYERS ---------------- */
  useEffect(() => {
    const handlePlayers = (players) => setPlayersOnline(players);

    socket.on("online_players", handlePlayers);
    return () => socket.off("online_players", handlePlayers);
  }, []);

  /* ---------------- GAME REQUEST ---------------- */

  const acceptRequest = () => {
    if (!requestAccepted) return;

    socket.emit("accept_request", {
      from: requestAccepted.from,
    });

    setRequestAccepted(null);
  };

  useEffect(() => {
    const handleGameRequest = (data) => {
      console.log("Game request received:", data);
      setRequestAccepted(data);
    };

    socket.on("game_request", handleGameRequest);

    return () => {
      socket.off("game_request", handleGameRequest);
    };
  }, []);



  /* ---------------- SCORE UPDATE ---------------- */
  useEffect(() => {
    const handleScoreUpdate = ({ moves, totals, lastMove }) => {
      setMoves(moves);
      setTotals(totals);
      dispatch(setLasrtMove(lastMove));
      dispatch(setMoves(moves));
    };

    socket.on("score_update", handleScoreUpdate);
    return () => socket.off("score_update", handleScoreUpdate);
  }, [dispatch]);

  /* ---------------- PLAYER LEFT ---------------- */
  useEffect(() => {
    const handlePlayerLeft = ({ name }) => {
      alert(`${name} left the game`);
      dispatch(setRoomId(""));
    };

    socket.on("player_left", handlePlayerLeft);
    return () => socket.off("player_left", handlePlayerLeft);
  }, [dispatch]);

  /* ---------------- ACTIONS ---------------- */


  const createRoom = (id) => {
    socket.emit("create_room", { targetSocketId: id });
    // console.log("Sent create_room to", id);
  }



  useEffect(() => {
    socket.on("error_msg", (msg) => {
      alert(msg);
    });
  }, []);

  const leaveRoom = () => {
    socket.emit("leave_room");
    dispatch(setRoomId(""));
    setMoves([]);
    setTotals({});
  };

  /* ---------------- HELPERS ---------------- */
  const getPlayerName = (id) =>
    playersOnline.find((p) => p.socketId === id)?.name || "Unknown";

  const [darkMode, setDarkMode] = useState(true);

  /* ---------------- UI ---------------- */
  return (
    <div className={darkMode ? "dark" : ""}>
      {/* 🌗 THEME TOGGLE */}
      {/* <button
        onClick={() => setDarkMode(!darkMode)}
        className="
          fixed top-4 right-4 z-50
          px-4 py-2 rounded-full font-bold
          bg-yellow-400 text-black
          dark:bg-slate-700 dark:text-white
          shadow-lg transition-all
        "
      >
        {darkMode ? "🌞 Light" : "🌙 Dark"}
      </button> */}

      {/* 🎮 MAIN PANEL */}
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
        {requestAccepted && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          bg-white text-black p-6 rounded-xl shadow-lg z-50
          dark:bg-slate-800 dark:text-white
          ">
            <p className="text-xl p-2 font-bold text-blue-700">Save the words with {requestAccepted.name}</p>
            <div className="flex justify-center gap-2">

             <GameButton color={'blue'} onClick={acceptRequest} text="Accept" />
             <GameButton color={'red'} onClick={() => setRequestAccepted(null)} text="Reject" />
            </div>
          </div>
        )}


        {/* 🚪 LEAVE GAME */}
        {roomId && (
          <button
            onClick={leaveRoom}
            className="
              bg-linear-to-b from-red-500 to-red-700
              px-6 py-3 rounded-xl font-bold tracking-wide
              shadow-[0_6px_0_#7f1d1d]
              hover:translate-y-1.5 hover:shadow-[0_4px_0_#7f1d1d]
              active:translate-y-1.5 active:shadow-none
              transition-all
            "
          >
            🚪 Leave Game
          </button>
        )}

        {/* 👥 ONLINE PLAYERS */}
        {!roomId && (
          <>
            <h3 className="text-xl font-bold tracking-wide text-green-500 dark:text-green-400">
              🟢 Players Online
            </h3>

            {playersOnline.map((p) => (
              <div
                key={p.socketId}
                onClick={() => createRoom(p.socketId)}
                className="
                  bg-white text-black border border-slate-200
                  p-2 rounded-lg cursor-pointer
                  hover:bg-slate-100 transition-all shadow-md
                  dark:bg-slate-800 dark:text-white
                  dark:border-slate-700 dark:hover:bg-slate-700
                "
              >
                🎮 {p.name}
              </div>
            ))}
          </>
        )}

        {/* 🏆 SCORE DETAILS */}
        {roomId && (
          <>
            <h3 className="text-xl font-bold text-black-500 dark:text-yellow-400">
              🏆 Total Scores
            </h3>

            {Object.keys(totals).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                {Object.entries(totals).map(([playerId, score]) => (
                  <div
                    key={playerId}
                    className={`
                      p-4 rounded-xl text-center
                      bg-white border border-slate-300
                      shadow-[0_6px_0_#cbd5e1]

                      dark:bg-linear-to-b dark:from-slate-700 dark:to-slate-900
                      dark:border-slate-600
                      dark:shadow-[0_8px_0_#020617]

                      ${playerId === socket.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-red-600 dark:text-red-400"
                      }
                    `}
                  >
                    <p className="text-sm uppercase tracking-widest">
                      {getPlayerName(playerId)}
                    </p>
                    <p className="text-3xl font-extrabold mt-1">{score}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="opacity-70">No scores yet</p>
            )}

            {/* 📜 MOVES HISTORY */}
            <h3 className="text-xl font-bold text-purple-500 dark:text-purple-400 mt-6">
              📜 Moves History
            </h3>

            {moves.length > 0 ? (
              <div
                className="
                  bg-white border border-slate-300
                  p-3 mt-2 rounded-xl max-h-64 overflow-auto space-y-2

                  dark:bg-slate-900 dark:border-slate-700
                "
              >
                {moves.map((move, index) => (
                  <div
                    key={index}
                    className="
                      flex justify-between items-center
                      bg-slate-100 text-black
                      px-3 py-2 rounded-lg shadow

                      dark:bg-slate-800 dark:text-white
                    "
                  >
                    <span className="font-semibold">
                      {getPlayerName(move.playerId)}
                    </span>
                    <span className="text-yellow-500 dark:text-yellow-300 font-bold">
                      {move.word}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold">
                      +{move.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="opacity-70">No moves yet</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;