// groupMappingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = JSON.parse(localStorage.getItem('groupMapping')) || {};

const groupMappingSlice = createSlice({
  name: "groupMapping",
  initialState,
  reducers: {
    setGroupMapping: (state, action) => {
      localStorage.setItem("groupMap", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const { setGroupMapping } = groupMappingSlice.actions;
export default groupMappingSlice.reducer;
