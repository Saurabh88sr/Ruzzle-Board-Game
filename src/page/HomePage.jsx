import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import { useDispatch, useSelector } from "react-redux";
import { setRoomId, } from "../store/UserSlice";
import GameButton from "../component/GameButton.jsx";

const HomePage = () => {
    const dispatch = useDispatch();
    const { roomId, lastMove, moves } = useSelector((state) => state.user);
    console.log("H from moves:", moves);
    const [game, setGame] = useState(null);
    console.log("HomePage game data:", game);
    const [boardData, setBoardData] = useState(Array(81).fill(null));
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [selectedCells, setSelectedCells] = useState([]);

    // for selection of word direction 
    // const [selectedCells, setSelectedCells] = useState([]);
    const [direction, setDirection] = useState(null);

    const inputRefs = useRef([]);



    /* ---------------- GAME START & UPDATE ---------------- */
    useEffect(() => {
        socket.on("game_start", ({ roomId, game }) => {
            dispatch(setRoomId(roomId));
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

    // fuction to handle cell selection for word forming
    const getDirection = (from, to) => {
        const dr = to.row - from.row;
        const dc = to.col - from.col;

        if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return null;

        return `${Math.sign(dr)},${Math.sign(dc)}`;
    };
    const getRowCol = (index) => ({
        row: Math.floor(index / 9),
        col: index % 9,
    });


    /* ---------------- SELECT CELL (FOR WORD FORMING) ---------------- */
    const handleCellSelect = (index) => {

        if (lastMove.playerId === socket.id && !isPlayerTurn) return; // prevent selection if last move was by this player
        if (!boardData[index]) return;
        if (isPlayerTurn) return;


        const current = getRowCol(index);

        // first cell
        if (selectedCells.length === 0) {
            setSelectedCells([index]);
            setDirection(null);
            return;
        }
        const lastIndex = selectedCells[selectedCells.length - 1];
        const last = getRowCol(lastIndex);

        const newDirection = getDirection(last, current);
        if (!newDirection) return;

        // second cell → lock direction
        if (selectedCells.length === 1) {
            setDirection(newDirection);
            setSelectedCells([...selectedCells, index]);
            return;
        }

        // later cells → must follow same direction
        if (newDirection !== direction) return;

        socket.emit("selected_cells", { roomId, selectedCells: [...selectedCells, index] });
        setSelectedCells((prev) =>
            prev.includes(index) ? prev : [...prev, index]
        );
    };




    // get selected cell values for display or processing

    const selectedCellValues = selectedCells.map(
        (idx) => boardData[idx]?.value || ""
    );
    // console.log("Selected Cells Values:", selectedCellValues);

    const joinletter = selectedCellValues.join("");

    const spellCheck = async (joinletter) => {
        if (moves.length > 0) {
            const isWordUsed = moves.some(
                (move) => move.word === joinletter
            );

            if (isWordUsed) {
                alert("This word is already used!");
                return;
            }
        }
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${joinletter}`);
            console.log("Spell check response:", response);
            if (response.ok) {

                socket.emit("spell_check", { roomId, word: joinletter, playerId: socket.id, status: true });
                if (joinletter.length >= 5) {
                    io.to(roomId).emit("reaction", {
                        emoji: "🔥",
                        from: "system",
                    });
                }

                // alert(`${joinletter} is a valid word!`);
                // const score = joinletter.length;
                // console.log(` is a valid word!`,score);
            } else {
                socket.emit("spell_check", { roomId, word: joinletter, playerId: socket.id, status: false })
            }
        } catch (error) {
            console.error("Error checking word:", error);
        } finally {
            // to make selectedCells empty after spell check
            socket.emit("selected_cells", { roomId, selectedCells: [] });
            console.log("it is finally block");
            setSelectedCells([]);
        }
    }
    /* ---------------- RECEIVE SELECTED CELLS FROM OPPONENT ---------------- */
    useEffect(() => {
        socket.on("selected_cells_update", ({ selectedCells: newSelectedCells, playerId }) => {
            if (playerId !== socket.id) {
                setSelectedCells(newSelectedCells);
            }
        });
        return () => socket.off("selected_cells_update");
    }, []);

    // socket.on("selected_cells_update", ({ selectedCells: newSelectedCells, playerId }) => {
    //     if (playerId !== socket.id) {
    //         setSelectedCells(newSelectedCells);
    //     }
    // });

    /* ---------------- WAITING SCREEN ---------------- */
    if (!roomId) {
        return (
            <div className="p-4 flex justify-center items-center bg-blue-50 h-screen">
                <div className="bg-blue-600 shadow p-8 rounded-lg">
                    <h2 className="text-white text-2xl">
                        Select a player to start the game!
                    </h2>
                </div>
            </div>
        );
    }

    /* ---------------- GAME BOARD ---------------- */
    return (
        <div>

            <div
                className="
                        p-4 flex justify-center items-center md:h-screen
                        bg-blue-50
                        dark:bg-linear-to-br dark:from-slate-900 dark:to-black
                        transition-colors duration-300
                    "
            >
                <div
                    className="
                        bg-blue-600
                        dark:bg-slate-800
                        shadow-2xl
                        p-4 md:p-8
                        rounded-xl
                        border border-blue-700
                        dark:border-slate-700
                        transition-colors
                        "
                >
                    {/* TITLE */}
                    <h2 className="text-white dark:text-yellow-400 text-2xl font-bold mb-4">
                        🎮 Ruzzle Game Board
                    </h2>

                    {/* BUTTON + TURN */}
                    <div className="flex justify-between items-center mb-4 gap-2">
                        <GameButton onClick={() => spellCheck(joinletter)} text="Spell" />

                        <div
                            className={`px-4 py-2 rounded-xl text-white font-semibold shadow
          ${isPlayerTurn
                                    ? "bg-green-500 dark:bg-green-600"
                                    : "bg-red-500 dark:bg-red-600"}
        `}
                        >
                            {isPlayerTurn ? "Your Turn" : "Opponent Turn"}
                        </div>
                    </div>

                    {/* GAME GRID */}
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
                                    border-4 border-white dark:border-slate-700
                                    shadow-lg
                                    w-10 h-10 sm:w-12 sm:h-12
                                    rounded-lg
                                    text-center text-xl font-bold
                                    transition-all duration-150

                                    ${cell
                                        ? cell.playerNo === 1
                                            ? "bg-yellow-300 dark:bg-yellow-500"
                                            : "bg-teal-300 dark:bg-teal-500"
                                        : "bg-white dark:bg-slate-900"}

                                    ${selectedCells.includes(index)
                                        ? "ring-4 ring-red-500"
                                        : ""}
                                    
                                    text-black dark:text-white
                                    ${isPlayerTurn ? "cursor-pointer" : "cursor-not-allowed"}
                                    focus:outline-none
                                `}
                            />
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default HomePage;
