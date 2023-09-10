import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('selectedPJ3')) || [];

const selectedPJ3Slice = createSlice({
  name: "selectedPJ3",
  initialState,
  reducers: {
    addPJ3: (state, action) => {
      const userId = action.payload;
      if (!state.includes(userId)) {
        state.push(userId);
        localStorage.setItem('selectedPJ3', JSON.stringify(state));
      }
    },
    removePJ3: (state, action) => {
      const userIdToRemove = action.payload;
      const updatedState = state.filter(userId => userId !== userIdToRemove);
      localStorage.setItem('selectedPJ3', JSON.stringify(updatedState));
      return updatedState;
    },
    clearSelectedPJ3: (state) => {
      state.length = 0;
      localStorage.setItem('selectedPJ3', []);
    },
  },
});

export const { addPJ3, removePJ3, clearSelectedPJ3 } = selectedPJ3Slice.actions;

export default selectedPJ3Slice.reducer;
