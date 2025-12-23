import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedCells, setCurrentPlayerIndex } from "../store/UserSlice";

const RightPanal = ({ playername }) => {
  const dispatch = useDispatch();
  const { scoreValue, selectedCells, currentPlayerIndex } = useSelector((state) => state.user);
  const [spellSet, setSpellSet] = useState();

  useEffect(() => {
    const filteredCells = selectedCells.filter(
      (cell) => cell.playerId === playername.id
    );
    const spell = filteredCells.map((cell) => cell.valuetext).join("");
    setSpellSet(spell);
    console.log("Current Spell:", spell);
  }, [selectedCells]);

  const checkspell = () => {
    console.log(`Player ${playername.name} submitted the spell: ${spellSet}`);
    spellingCheck(spellSet);
  }

  const [preveusWord, setPreveusWord] = useState("");
  const [score, setScore] = useState(0);

  const spellingCheck = async (word) => {
    const isCorrect = await checkSpelling(word);
    if (isCorrect) {
      setScore((prevScore) => prevScore + word.length);
      setPreveusWord([...preveusWord, { word: word, score: word.length, icon: '✅' }]);
    } else {
      setPreveusWord([...preveusWord, { word: word, score: 0, icon: '❌' }]);
    }
    // console.log(isCorrect ? "✅ Correct" : "❌ Wrong");
    dispatch(setSelectedCells([])); // Clear selected cells after checking
    let change = currentPlayerIndex === 0 ? 1 : 0;
    dispatch(setCurrentPlayerIndex(change));
  };

  const checkSpelling = async (word) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      console.log("Spelling check response:", res);
      return res.ok;
    } catch {
      return false;
    }
  };



  // derive data directly (no setState in effect)
  const currentLetters = scoreValue
    ?.filter((item) => item.playerId === playername.id)
    .sort((a, b) => a.index - b.index);

  return (
    <div className=" sm:w-full sm:h-screen overflow-auto border-l-2 bg-white border-gray-300 grid grid-cols-1 sm:grid-cols-1 p-4 ">
      {/* Header */}


      {/* Player Info */}
      <div className="">
        <div className="bg-blue-500 rounded p-2 text-white font-semibold">
          {playername.name}
        </div>
      </div>


      <div>
        <div className="">
          <h3 className="sm:text-lg font-semibold mb-2">Current Spell</h3>
          <div className="p-2 bg-white border rounded">
            {spellSet || "No letters selected"}
          </div>
          <button className="bg-black/95 text-white p-1 w-full rounded-xl mt-2" type="submit" onClick={checkspell}>Submit</button>
        </div>
      </div>


      <div>
        <div className="bg-white">
          <h3 className="text-lg font-semibold mb-2">Score: {score}</h3>
        </div>
      </div>
      <div>
        <div className="bg-slate-100 p-4 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Previous Word</h3>
          {preveusWord.length === 0 ? (
            <p className="text-gray-500">No previous word</p>
          ) : (
            <div>
              {preveusWord.map((word, index) => (
                <div key={index}>
                  <span className="font-bold">{word.word}</span> - Score: {word.score} {word.icon}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      {/* Score Section */}
      <div className=" sm:p-4  mt-auto">
        <h3 className="sm:text-lg font-semibold mb-2">Score Letters</h3>

        {currentLetters.length === 0 ? (
          <p className="text-gray-500">No letters yet</p>
        ) : (
          <div className="grid grid-cols-10 gap-2">
            {currentLetters.map((item) => (
              <div
                key={item.index}
                className="sm:w-8 sm:h-8 w-5 h-5 flex items-center justify-center bg-white border rounded font-bold"
              >
                {item.value}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 font-semibold">
          Total Letters: {currentLetters.length}
        </div>
      </div>
    </div>
  );
};

export default RightPanal;
