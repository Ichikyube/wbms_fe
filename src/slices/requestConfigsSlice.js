import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import api from "../api/api";

// get initial value by fetch and put the value to localStorage.
const initialState = {
  zeroLock: "",
  stableLock: "",
  backDatedForm: "",
  // backDatedTemplate: "",
  // manualEntryWB: "",
  // manualBackdatedForm: "",
  // editTransactionMinusWeightAndDate: "",
  // editTransactionFullForm: "",
  error: null,
};

export const fetchConfigsData = createAsyncThunk(
  "requestConfigs/fetchConfigsData",
  async () => {
    const response = await api.get(`/configs`);
    const requests = await response.data;
    const configItemsData = requests.data.config.records;
    let configItems = configItemsData.map(({ name, status }) => ({
      [name]:status
    }));
    console.log(configItems);
    localStorage.setItem("customConfigs",  JSON.stringify(configItems));
    return configItems;
  }
);
// Define an async thunk for handling level transitions
export const handleApproval = createAsyncThunk(
  'requestConfigs/handleApproval',
  async (level, thunkAPI) => {
    // Perform the approval logic and transition
    const response = await api.post(`/config-request`,level);

    // dispatch other actions or perform other logic here
    // ...

    return response.data; // Return the response data if needed
  }
);

  /**
   * di FrontEnd, apabila status configRequest active maka status config adalah kebalikan dari status config default
   */
const requestConfigSlice = createSlice({
  name: "requestConfigs",
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
  extraReducers: (builder) => {
    builder.addCase(fetchConfigsData.fulfilled, (state, {payload}) => {
      console.log("nah" + payload);
      state.user = payload[0];
      state.zeroLock=payload[1];
      state.stableLock=payload[3];
      state.backDatedForm=payload[4];
      // state.backDatedTemplate=payload[5],
      // state.manualEntryWB=payload[6],
      // state.manualBackdatedForm,
      // state.editTransactionMinusWeightAndDate,
      // state.editTransactionFullForm
    });

  },
});

export const configRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchRequests: builder.query({
      query: () => "config-requests",
      pollingInterval: 5000, // Every 5 seconds
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
  useFetchRequestsQuery,
  useCreateRequestMutation,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = configRequestApi;
export const { addRequestConfig, editRequestConfig, removeRequestConfig } =
  requestConfigSlice.actions;
export default requestConfigSlice.reducer;


