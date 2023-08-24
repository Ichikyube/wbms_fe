import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('selectedPJ1')) || [];

const selectedPJ1Slice = createSlice({
  name: "selectedPJ1",
  initialState,
  reducers: {
    addPJ1: (state, action) => {
      const userId = action.payload;
      if (!state.includes(userId)) {
        state.push(userId);
        localStorage.setItem('selectedPJ1', JSON.stringify(state));
      }
    },
    removePJ1: (state, action) => {
      const userIdToRemove = action.payload;
      const updatedState = state.filter(userId => userId !== userIdToRemove);
      localStorage.setItem('selectedPJ1', JSON.stringify(updatedState));
      return updatedState;
    },
    clearSelectedPJ1: (state) => {
      state.length = 0;
      localStorage.setItem('selectedPJ1', []);
    },
  },
});

export const { addPJ1, removePJ1, clearSelectedPJ1 } =
  selectedPJ1Slice.actions;

export default selectedPJ1Slice.reducer;
