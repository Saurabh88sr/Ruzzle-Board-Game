import { createSlice } from "@reduxjs/toolkit";

const scoreValue = [];
const playername = [];
const selectedCells = [];
const currentPlayerIndex = 0;

export const userSlice = createSlice({
  name: "counter",
  initialState: {
    scoreValue: scoreValue,
    playername: playername,
    selectedCells: selectedCells,
    currentPlayerIndex: currentPlayerIndex,
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
} = userSlice.actions;

export default userSlice.reducer;
