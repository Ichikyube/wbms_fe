import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('selectedPJ2')) || [];

const selectedPJ2Slice = createSlice({
  name: "selectedPJ2",
  initialState,
  reducers: {
    addPJ2: (state, action) => {
      const userId = action.payload;
      if (!state.includes(userId)) {
        state.push(userId);
        localStorage.setItem('selectedPJ2', JSON.stringify(state));
      }
    },
    removePJ2: (state, action) => {
      const userIdToRemove = action.payload;
      const updatedState = state.filter(userId => userId !== userIdToRemove);
      localStorage.setItem('selectedPJ2', JSON.stringify(updatedState));
      return updatedState;
    },
    clearSelectedPJ2: (state) => {
      state.length = 0;
      localStorage.setItem('selectedPJ2', []);
    },
  },
});

export const { addPJ2, removePJ2, clearSelectedPJ2 } =
  selectedPJ2Slice.actions;

export default selectedPJ2Slice.reducer;
