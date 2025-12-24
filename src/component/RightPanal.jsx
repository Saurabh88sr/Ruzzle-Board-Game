import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socket from "../socket";
import { setSelectedCells, setCurrentPlayerIndex } from "../store/UserSlice";

const RightPanal = ({ playername }) => {
  const dispatch = useDispatch();
  const { scoreValue, selectedCells, currentPlayerIndex } = useSelector(
    (state) => state.user
  );
  console.log("RighPanal scoreValue:", scoreValue);

  const [myProfile, setMyProfile] = useState(null);


  // ✅ My profile (ONLY ONCE)
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







  return (
    <div className="w-full h-screen overflow-auto p-4 border-l">

      {/* PROFILE */}
      <div className="bg-blue-500 text-white p-2 rounded">
        {myProfile ? (
          <>
            <p>Name: {myProfile.name}</p>
            <p>ID: {myProfile.id}</p>
          </>
        ) : (
          "Loading profile..."
        )}
      </div>

      {/* SPELL */}
      <div className="mt-4">
        <h3>Current Spell</h3>
        <div className="border p-2">{spell || "None"}</div>
        <button onClick={checkspell} className="bg-black text-white p-2 mt-2">
          Submit
        </button>
      </div>
    </div>
  );
};

export default RightPanal;
