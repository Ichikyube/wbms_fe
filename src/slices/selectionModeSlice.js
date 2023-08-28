// selectionModeSlice.js
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  active: false,
  group: "PJ1",
};

const selectionModeSlice = createSlice({
  name: 'selectionMode',
  initialState,
  reducers: {
    toggleSelectionMode: (state) => {
      return {
        ...state,
        active: !state.active,
      };
    },
    setGroup: (state, action) => {
      return {
        ...state,
        group: action.payload,
      };
    },
  },
});

export const { toggleSelectionMode, setGroup } = selectionModeSlice.actions;
export default selectionModeSlice.reducer;
