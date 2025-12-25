import { useEffect, useRef, useState } from "react";
import socket from "../socket";

const HomePage = () => {
    const [roomId, setRoomId] = useState(null);
    const [game, setGame] = useState(null);
    console.log("HomePage game data:", game);
    const [boardData, setBoardData] = useState(Array(81).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);

    const inputRefs = useRef([]);

    /* ---------------- GAME REQUEST ---------------- */
    useEffect(() => {
        socket.on("game_request", ({ from, name }) => {
            if (window.confirm(`Play with ${name}?`)) {
                socket.emit("accept_request", { from });
            }
        });

        return () => socket.off("game_request");
    }, []);

    /* ---------------- GAME START & UPDATE ---------------- */
    useEffect(() => {
        socket.on("game_start", ({ roomId, game }) => {
            setRoomId(roomId);
            setGame(game);
            setBoardData(game.board);
            setIsPlayerTurn(game.turn === socket.id);
            setSelectedCells([]);
        });

        socket.on("game_update", (game) => {
            setGame(game);
            setBoardData(game.board);
            setIsPlayerTurn(game.turn === socket.id);
            setSelectedCells([]); // clear selection on turn change
        });

        return () => {
            socket.off("game_start");
            socket.off("game_update");
        };
    }, []);

    /* ---------------- AUTO FOCUS NEXT EMPTY CELL ---------------- */
    useEffect(() => {
        const nextIndex = boardData.findIndex((cell) => !cell);
        if (nextIndex !== -1) {
            inputRefs.current[nextIndex]?.focus();
        }
    }, [boardData]);

    /* ---------------- VALID LETTER ---------------- */
    const isValidLetter = (key) => /^[A-Z]$/.test(key);

    /* ---------------- MAKE MOVE ---------------- */
    const handleKeyDown = (e, index) => {
        if (!isPlayerTurn) return;

        const key = e.key.toUpperCase();

        // allow only A-Z
        if (!/^[A-Z]$/.test(key)) return;

        // prevent overwrite
        if (boardData[index]) return;

        socket.emit("make_move", {
            roomId,
            index,
            value: key,
        });
    };
    console.log("boardData boardData:", boardData);

    /* ---------------- SELECT CELL (FOR WORD FORMING) ---------------- */
    const handleCellSelect = (index) => {
        if (!boardData[index]) return;
        if (!isPlayerTurn) return;

        setSelectedCells((prev) =>
            prev.includes(index) ? prev : [...prev, index]
        );
    };

    /* ---------------- WAITING SCREEN ---------------- */
    if (!roomId) {
        return (
            <div className="p-4 flex justify-center items-center bg-blue-50 h-screen">
                <div className="bg-blue-600 shadow p-8 rounded-lg">
                    <h2 className="text-white text-2xl">
                        Waiting for players to join...
                    </h2>
                </div>
            </div>
        );
    }

    /* ---------------- GAME BOARD ---------------- */
    return (
        <div className="p-4 flex justify-center items-center bg-blue-50 sm:h-screen">
            <div className="bg-blue-600 shadow p-4 sm:p-8 rounded-lg">
                <div className="flex justify-between mb-4">
                    <h2 className="text-white text-2xl">Ruzzle Game Board</h2>
                    <div
                        className={`px-4 py-2 rounded text-white font-semibold ${isPlayerTurn ? "bg-green-500" : "bg-red-500"
                            }`}
                    >
                        {isPlayerTurn ? "Your Turn" : "Opponent Turn"}
                    </div>
                </div>

                <div className="grid grid-cols-9 gap-1">
                    {boardData.map((cell, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            value={cell?.value || ""}
                            readOnly
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onClick={() => handleCellSelect(index)}
                            className={`
                                        border-4 border-white shadow
                                        w-10 h-10 sm:w-12 sm:h-12
                                        rounded text-center text-xl font-bold
                                        
                                        ${cell
                                    ? cell.playerNo === 1
                                        ? "bg-yellow-300"
                                        : "bg-teal-300 "
                                    : "bg-white"}
                                       ${selectedCells.includes(index)
                                    ? "ring-4 ring-red-500"
                                    : ""}
                                    ${cell?.value ? "cursor-pointer" : ""}
                                    ${isPlayerTurn ? "cursor-pointer" : "cursor-not-allowed"}
                                            focus:outline-none
                                        `}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default HomePage;
