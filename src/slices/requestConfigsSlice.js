import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";
import api from "../api/api";


  /**
   * filter config yang( active/yang status tidak sama dengan default) di context matrixapproval 
   * taruh pada array tempConfig yang disimpan di storage item
   * Pada komponen dengan temporary config, buat state bernama <configItem>
   * tempConfig.include(<configItem>) apabila true maka component active. 
   * 
   * Apabila date.now melampaui nilai end maka status kembali ke default, start menjadi kosong, end menjadi kosong.
   * **Checking if the Feature is Active**:
   * Remember to adjust the date and time formats to match your specific requirements and the way dates are handled in your application.
   *  Once you have `activationTime` and `expirationTime` defined, you can use them to determine if the feature is currently active or not.
   */
  // apabila status configRequest approve maka kirim scedhule to config start, update status config menjadi kebalikan default, nilai end menjadi start ditambah livespan.
/*
 * di FrontEnd, apabila status configRequest active maka status config adalah kebalikan dari status config default
 */
// zeroLock: "",
// stableLock_period: "3000",  //waktu stableLockTime nilai INT
// backDatedForm: "disabled",  // backDatedTemplate: "",
// minimumWeight: "1", //nilai INT
// portWB: "9001",
// manualEntryWB: "disabled",
// manualBackdatedForm: "disabled",
// editTransactionMinusWeightAndDate: "disabled",
// editTransactionFullForm: "disabled",
// signBONTRIP: {PGS:"", MILLHEAD:""}, //nilai Object {PGS:<NAMA>,millHead:<NAMA}
// get initial value by fetch and put the value to localStorage.
const initialState = {
  backDatedForm: false,
  manualEntryWB: false,
  backdatedTemplate: false,
  editTransaction: false,
};

const requestConfigSlice = createSlice({
  name: "requestConfig",
  initialState,
  reducers: {
    setBackDatedForm: (state, action) => {
      state.backDatedForm = action.payload;
    },
    setManualEntryWB: (state, action) => {
      state.manualEntryWB = action.payload;
    },
    setBackdatedTemplate: (state, action) => {
      state.backdatedTemplate = action.payload;
    },
    setEditTransaction: (state, action) => {
      state.editTransaction = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConfigsData.fulfilled, (state, { payload }) => {
      state.user = payload[0];
      state.zeroLock = payload[1];
      state.stableLock = payload[3];
      state.backDatedForm = payload[4];
      // state.backDatedTemplate=payload[5],
      // state.manualEntryWB=payload[6],
      // state.manualBackdatedForm,
      // state.editTransactionMinusWeightAndDate,
      // state.editTransactionFullForm
    });
  },
});

export const fetchConfigsData = createAsyncThunk(
  "requestConfigs/fetchConfigsData",
  async () => {
    const response = await api.get(`/configs`);
    const requests = await response.data;
    const configItemsData = requests.data.config.records;
    let configItems = configItemsData.map(({ name, status }) => ({
      [name]: status,
    }));
    // console.log(configItems);
    localStorage.setItem("customConfigs", JSON.stringify(configItems));
    return configItems;
  }
);
// Define an async thunk for handling level transitions
export const handleApproval = createAsyncThunk(
  "requestConfigs/handleApproval",
  async (level, thunkAPI) => {
    // Perform the approval logic and transition
    const response = await api.post(`/config-request`, level);

    // dispatch other actions or perform other logic here
    // ...

    return response.data; // Return the response data if needed
  }
);

export const configRequestApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveConfigsToday: builder.query({
      query: () => 'configs/active-today', 
      async onQueryCompleted(response, api) {
        // Save the response data to local storage
        localStorage.setItem('activeConfigsToday', JSON.stringify(response.data));
      },
    }),
    fetchRequests: builder.query({
      query: () => "config-requests",
      pollingInterval: 1000, // Every 5 seconds
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
export const { setBackDatedForm, setManualEntryWB, setBackdatedTemplate, setEditTransaction } = requestConfigSlice.actions;
export default requestConfigSlice.reducer;
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
