import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";

const token = localStorage.getItem("wbms_at");
export const configRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRequests: builder.query({
      query: () => "config-requests",
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
        method: "PUT",
        mode: "cors",
        credentials: "include",
      }),
    }),
    rejectRequest: builder.mutation({
      query: (requestId) => ({
        url: `config-requests/${requestId}/reject`,
        method: "PUT",
        mode: "cors",
        credentials: "include",
      }),
    }),
  }),
});

const initialState = {
  requestList: [],
  loading: false,
  error: null,
};

const requestConfigSlice = createSlice({
  name: "requestConfig",
  initialState,
  reducers: {
    addRequestConfig: (state, action) => {
      state.push(action.payload);
    },
    editRequestConfig: (state, action) => {
      state.Name = state.Name.map((items) =>
        items.id === action.payload.id
          ? { ...items, status: "Accepted" }
          : items
      );
    },
    removeRequestConfig: (state, action) => {
      state.Name = state.Name.map((items) =>
        items.id === action.payload.id
          ? { ...items, status: "Rejected" }
          : items
      );
    },
  },
});

export const {
  useFetchRequestsQuery,
  useCreateRequestMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = configRequestApi;
export const { addRequestConfig, editRequestConfig, removeRequestConfig } =
  requestConfigSlice.actions;
export default requestConfigSlice.reducer;
