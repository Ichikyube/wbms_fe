import { createSlice } from "@reduxjs/toolkit";

const selectedUsersSlice = createSlice({
  name: "selectedUsers",
  initialState: JSON.parse(localStorage.getItem('selectedUsers')) || [],
  reducers: {
    addUser: (state, action) => {
      const newUser = action.payload;
      if (!state.includes(newUser)) {
        state.push(newUser);
      }
    },
    removeUser: (state, action) => {
      const userIdToRemove = action.payload;
      return state.filter((user) => user.id !== userIdToRemove);
    },
    clearSelectedUsers: (state) => {
      return [];
    },
  },
});

export const { addUser, removeUser, clearSelectedUsers } = selectedUsersSlice.actions;

export default selectedUsersSlice.reducer;