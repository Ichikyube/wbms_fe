import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
const initialState = JSON.parse(localStorage.getItem('groupMap')) || {};

export const configRequestAdminApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    fetchGroupMapping: builder.query({
        query: () => `/config-requests-admin`,
    }),
    saveGroupMapping: builder.mutation({
        query: (groupMapping) => ({
            url: '/config-requests-admin',
            method: "POST",
            body: groupMapping,
            mode: "cors",
            credentials: "include",
        }),
    }),
  })
});

// dispatch(saveGroupMappingToBackend(groupMapping));
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

export const {
  useFetchGroupMappingQuery,
  useSaveGroupMappingMutation,
} = configRequestAdminApi;
export const { setGroupMapping } = groupMappingSlice.actions;
export default groupMappingSlice.reducer;