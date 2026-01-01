import React from "react";

const GameButton = ({ text, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3
        text-lg font-bold uppercase tracking-wider
        rounded-xl
        transition-all duration-200
        shadow-[0_6px_0_#1e3a8a]
        bg-linear-to-b from-blue-500 to-blue-700
        text-white
        hover:translate-y-1.5
        hover:shadow-[0_4px_0_#1e3a8a]
        active:translate-y-1.5
        active:shadow-none
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
    >
      {text}
    </button>
  );
};

export default GameButton;
