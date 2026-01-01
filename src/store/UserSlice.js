import { createSlice } from "@reduxjs/toolkit";

const scoreValue = [];
const playername = [];
const selectedCells = [];
const currentPlayerIndex = 0;
const roomId = null;
const lastMove = [];
const moves = [];

export const userSlice = createSlice({
  name: "counter",
  initialState: {
    scoreValue: scoreValue,
    playername: playername,
    selectedCells: selectedCells,
    currentPlayerIndex: currentPlayerIndex,
    roomId: roomId,
    lastMove: lastMove,
    moves: moves,
  },
  reducers: {
    setScoreValue: (state, action) => {
      state.scoreValue = action.payload;
    },
    setPlayerName: (state, action) => {
      state.playername = action.payload;
    },
    setSelectedCells: (state, action) => {
      state.selectedCells = action.payload;
    },
    setCurrentPlayerIndex: (state, action) => {
      state.currentPlayerIndex = action.payload;
    },
    setRoomId: (state, action) => {
      state.roomId = action.payload;
    },
    setLasrtMove: (state, action) => {
      state.lastMove = action.payload;
    },
    setMoves: (state, action) => {
      state.moves = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  setScoreValue,
  setPlayerName,
  setSelectedCells,
  setCurrentPlayerIndex,
  setRoomId,
  setLasrtMove,
  setMoves,
} = userSlice.actions;

export default userSlice.reducer;
