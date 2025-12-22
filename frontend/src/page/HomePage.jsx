import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setScoreValue } from "../store/UserSlice";

const HomePage = () => {
    const dispatch = useDispatch();
    const { playername } = useSelector((state) => state.user);

    // 0 => Player 1, 1 => Player 2
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [serialNo, setSerialNo] = useState(1);

    // 9x9 board (81 cells)
    const [boardData, setBoardData] = useState(Array(81).fill(null));
    const inputRefs = useRef([]);

    console.log("playername in boardData boardData", boardData);
    const activePlayer = playername[currentPlayerIndex];

    // allow only letters
    const isValidLetter = (key) => /^[a-zA-Z]$/.test(key);


    const handleChange = (e, index) => {
        const value = e.target.value.toUpperCase();

        // allow only letters
        if (!/^[A-Z]$/.test(value)) return;

        // prevent overwrite
        if (boardData[index]) return;

        const newBoard = [...boardData];
        newBoard[index] = {
            sno: serialNo,
            index,
            value,
            playerId: activePlayer?.id ?? currentPlayerIndex + 1,
            playerName: activePlayer?.name,
            playerNo: activePlayer?.player,
        };
        setSerialNo(serialNo + 1);

        setBoardData(newBoard);
        setCurrentPlayerIndex((prev) => (prev === 0 ? 1 : 0));

        // auto focus next empty box (sequence)
        const nextIndex = newBoard.findIndex(
            (cell, i) => !cell && i > index
        );

        if (nextIndex !== -1) {
            setTimeout(() => {
                inputRefs.current[nextIndex]?.focus();
            }, 0);
        }
    };

    useEffect(() => {
        // send filled cells to redux
        dispatch(setScoreValue(boardData.filter(Boolean)));
    }, [boardData, dispatch]);

    // focus first box on load
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const getValue = (e) => {
        console.log('clicked value', e.target.value);
        e.target.value = "";
    }

    if (playername.length < 2) {
        return (
            <div className="p-4 flex justify-center items-center bg-blue-50 h-screen">
                <div className="bg-linear-to-r from-blue-700 to-blue-600 shadow p-8 rounded-lg">
                    <h2 className="text-white text-2xl">
                        Waiting for players to join...
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 flex justify-center items-center bg-blue-50 h-screen">
            <div className="bg-linear-to-r from-blue-700 to-blue-600 shadow p-8 rounded-lg">
                <h2 className="text-white text-2xl mb-4">
                    Ruzzle Game Board
                </h2>

                <h3 className="text-white text-lg mb-4">
                    Active Player: {activePlayer?.name}
                </h3>

                <div className="grid grid-cols-9 gap-1">
                    {boardData.map((cell, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength={1}
                            value={cell ? cell.value : ""}
                            readOnly={!!cell}
                            onKeyDown={(e) => {
                                if (!isValidLetter(e.key) && e.key !== "Backspace") {
                                    e.preventDefault();
                                }
                            }}
                            onChange={(e) => handleChange(e, index)}
                            onClick={(e)=>getValue(e)}
                            className={`border-4 shadow border-white w-12 h-12 rounded text-center text-xl font-bold
                              ${cell
                                    ? cell.playerNo === 1
                                        ? "bg-yellow-300 cursor-pointer"
                                        : "bg-teal-300 cursor-pointer"
                                    : "bg-white"
                                } 
                              focus:outline-blue-400`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
