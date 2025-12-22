import React from "react";
import { useSelector } from "react-redux";

const RightPanal = ({ playername }) => {
  const { scoreValue } = useSelector((state) => state.user);

  // derive data directly (no setState in effect)
  const currentLetters = scoreValue
    ?.filter((item) => item.playerId === playername.id)
    .sort((a, b) => a.index - b.index);

  return (
    <div className="w-1/4 h-screen border-l-2 border-gray-300 flex flex-col">
      {/* Header */}
      <div className="bg-blue-500 p-4 text-white font-semibold">
        Player Panel
      </div>

      {/* Player Info */}
      <div className="bg-white p-4">
        <div>
          <strong>ID:</strong> {playername.id}
        </div>
        <div>
          <strong>Name:</strong> {playername.name}
        </div>
      </div>

      {/* Score Section */}
      <div className="bg-gray-100 p-4 mt-auto">
        <h3 className="text-lg font-semibold mb-2">Score Letters</h3>

        {currentLetters.length === 0 ? (
          <p className="text-gray-500">No letters yet</p>
        ) : (
          <div className="grid grid-cols-6 gap-2">
            {currentLetters.map((item) => (
              <div
                key={item.index}
                className="w-8 h-8 flex items-center justify-center bg-white border rounded font-bold"
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
