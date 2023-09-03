import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import api from "../api/api";

const initialState = localStorage.getItem("groupMap") === undefined? JSON.parse(localStorage.getItem("groupMap")) : {};

export const fetchGroupMappingData = createAsyncThunk(
  "groupMapping/fetchGroupMappingData",
  async () => {
    const response = await api.get(`/config-requests-admin`);
    return response.data; // Assuming the query returns the group mapping data
  }
);

export const configRequestAdminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saveGroupMapping: builder.mutation({
      query: (groupMapping) => ({
        url: "/config-requests-admin",
        method: "POST",
        body: groupMapping,
        mode: "cors",
        credentials: "include",
      }),
    }),
  }),
});

const groupMappingSlice = createSlice({
  name: "groupMapping",
  initialState,
  reducers: {
    addPJ1: (state, action) => {
      const userId = action.payload;
      state[userId] = "PJ1"
    },
    addPJ2: (state, action) => {
      const userId = action.payload;
      state[userId] = "PJ2"
    },
    addPJ3: (state, action) => {
      const userId = action.payload;
      state[userId] = "PJ3"
    },
    removeUser: (state, action) => {
      const userIdToRemove = action.payload;
      console.log(userIdToRemove)
      const updatedState = { ...state };
      delete updatedState[userIdToRemove];
      console.log(updatedState);
      return updatedState;
    },
    // clearSelectedPJ1: (state) => {
    //   return state.length = 0;
    // },
    // clearSelectedPJ2: (state) => {
    //   return state.length = 0;
    // },
    // clearSelectedPJ3: (state) => {
    //   return (state.length = 0);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGroupMappingData.fulfilled, (state, action) => {
      const {lvlMap} = action.payload;

      localStorage.setItem("groupMap", JSON.stringify(lvlMap));
      return state = lvlMap; // Set the fetched data as the initial state
    });
    builder.addCase(fetchGroupMappingData.rejected, (state, action) => {
      const {lvlMap} = action.payload;

      localStorage.setItem("groupMap", JSON.stringify(lvlMap));
      return state = lvlMap; // Set the fetched data as the initial state
    });
  },
});

export const { useSaveGroupMappingMutation } =
  configRequestAdminApi;
export const { addPJ1, addPJ2, addPJ3, removeUser } = groupMappingSlice.actions;
export default groupMappingSlice.reducer;
