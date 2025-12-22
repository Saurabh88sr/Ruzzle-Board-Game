import { createSlice } from "@reduxjs/toolkit";

const scoreValue = [];
const playername = [];

export const userSlice = createSlice({
  name: "counter",
  initialState: {
    scoreValue: scoreValue,
    playername: playername,
  },
  reducers: {
    setScoreValue: (state, action) => {
      state.scoreValue = action.payload;
    },
    setPlayerName: (state, action) => {
      state.playername = action.payload;
    },
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
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
} = userSlice.actions;

export default userSlice.reducer;
