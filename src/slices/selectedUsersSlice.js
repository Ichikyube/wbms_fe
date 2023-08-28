import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from '@reduxjs/toolkit';

// Define an async thunk action to save selectedUsers to the backend
export const saveSelectedUsers = createAsyncThunk(
  'selectedUsers/saveSelectedUsers',
  async (selectedUsers, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/save-selected-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUsers),
      });

      if (!response.ok) {
        throw new Error('Failed to save selected users');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
//pj3, pj2, pj1, ambil list dari, grupmap.  Ketika selesai memilih save ke grup map, lalu save ke database. Grup map, akan di save ke 

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
  extraReducers: (builder) => {
    builder.addCase(saveSelectedUsers.fulfilled, (state, action) => {
      // Handle successful API response if needed
    });

    builder.addCase(saveSelectedUsers.rejected, (state, action) => {
      // Handle error if needed
    });
  },
});

export const { addUser, removeUser, clearSelectedUsers } = selectedUsersSlice.actions;

export default selectedUsersSlice.reducer;