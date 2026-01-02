import React from "react";

const GameButton = ({ text, onClick, disabled, color }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3
        text-lg font-bold uppercase tracking-wider
        rounded-xl
        transition-all duration-200
        shadow-[${color === 'red' ? '0_6px_0_#7f1d1d' : '0_6px_0_#1e3a8a'}]
        ${color === 'red' ? 'bg-linear-to-b from-red-500 to-red-700' : 'bg-linear-to-b from-blue-500 to-blue-700'}
        text-white
        hover:translate-y-1.5
        hover:shadow-[${color === 'red' ? '0_4px_0_#7f1d1d' : '0_4px_0_#1e3a8a'}]
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
