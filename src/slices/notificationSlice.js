import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
// Define an asynchronous thunk for fetching notifications from the API
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const response = await fetch("/api/notifications"); // Replace with your actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
    const data = await response.json();
    return data;
  }
);

export const createNotificationAsync = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      // Make an API request to create a notification with notificationData
      const response = await api.post('/notifications', notificationData);

      if (!response.ok) {
        // Handle non-successful responses here (e.g., validation errors)
        const errorData = await response.json();
        return rejectWithValue(errorData);
      }

      const createdNotification = await response.json();
      return createdNotification;
    } catch (error) {
      // Handle network errors or unexpected errors here
      return rejectWithValue(error.message);
    }
  }
);
// Define an initial state
const initialState = {
  notifications: [],
  status: "idle",
  error: null,
};

// Create a slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    notificationAdded(state, action) {
      state.notifications.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createNotificationAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createNotificationAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications.push(action.payload);
      })
      .addCase(createNotificationAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { notificationAdded } = notificationSlice.actions;
export default notificationSlice.reducer;
