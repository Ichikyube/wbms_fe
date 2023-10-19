import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";
import api from "../api/api";

// Define an async thunk for handling level transitions
export const handleApproval = createAsyncThunk(
  "requestConfigs/handleApproval",
  async (level, thunkAPI) => {
    // Perform the approval logic and transition
    const response = await api.post(`/config-request`, level);

    // dispatch other actions or perform other logic here
    // ...

    return response?.data; // Return the response data if needed
  }
);

export const configRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRequests: builder.query({
      query: () => "config-requests",
      pollingInterval: 1000,
    }),
    createRequest: builder.mutation({
      query: (requestData) => ({
        url: "config-requests", // Replace with your actual API endpoint
        method: "POST",
        body: requestData,
      }),
    }),
    approveRequest: builder.mutation({
      query: (requestId) => ({
        url: `config-requests/${requestId}/approve`,
        method: "PATCH",
        mode: "cors",
        credentials: "include",
      }),
    }),
    rejectRequest: builder.mutation({
      query: (requestId) => ({
        url: `config-requests/${requestId}/reject`,
        method: "PATCH",
        mode: "cors",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetActiveConfigsTodayQuery,
  useFetchRequestsQuery,
  useCreateRequestMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = configRequestApi;
export const selectRequestConfigs = (state) => state.requestConfig;

export const selectFilteredRequestConfigs = (
  state,
  startTime,
  endTime,
  status
) => {
  return state.requestConfig.filter((config) => {
    const meetsStartTime = !startTime || config.starttime >= startTime;
    const meetsEndTime = !endTime || config.endtime <= endTime;
    const meetsStatus = !status || config.status === status;
    return meetsStartTime && meetsEndTime && meetsStatus;
  });
};
