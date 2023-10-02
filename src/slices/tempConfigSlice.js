import { createSlice } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";


// zeroLock: "",
// stableLockPeriod: "3000",  //waktu stableLockTime nilai INT
// minimumWeight: "1", //nilai INT
// portWB: "9001",
// editTransactionMinusWeightAndDate: "disabled",
// editTransactionFullForm: "disabled",
// signBONTRIP: {PGS:"", MILLHEAD:""}, //nilai Object {PGS:<NAMA>,millHead:<NAMA}Bontrip TBS
export const initialTempConfigState = {
  tempConfigDt: JSON.parse(localStorage.getItem("tempConfigs")), // This will store the config data
  status: "idle",
  error: null,
};

const tempConfigSlice = createSlice({
  name: "tempConfigs",
  initialState: initialTempConfigState,
  reducers: {
    getTempConfigs: (state, action) => {
      state.status = "loading";
      // Simulate an API request to fetch temp configs
      setTimeout(() => {
        state.tempConfigDt = JSON.parse(localStorage.getItem("tempConfigs"));
        state.status = "succeeded";
      }, 1000); // Simulating a delay of 1 second (replace with actual API call)
    },
    setTempConfigs: (state, action) => {
      state.tempConfigDt = action.payload;
      state.status = "succeeded";
      localStorage.setItem("tempConfigs", JSON.stringify(action.payload));
    },
    clearTempConfigs: (state, action) => {
      state.tempConfigDt = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("tempConfigs");
    },
  },
});

const switchByType = (value, type) =>
  type === "Number"
    ? parseInt(value)
    : type === "Boolean"
    ? value?.toLowerCase?.() === "true"
    : type === "Json"
    ? JSON.parse(value)
    : value;

export const tempConfigApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchConfigsData: builder.query({
      query: () => "/configs",
      transformResponse: (response) => {
        const res = response.data;
        const configItemsData = res.config.records;
        const configItems = configItemsData.map(
          ({ name, defaultVal, type }) => ({
            [name]: switchByType(defaultVal, type),
          })
        );
        localStorage.setItem("tempConfigs", JSON.stringify(configItems));
        return configItems;
      },
    }),
    fetchActiveConfigsData: builder.query({
      query: () => "/configs/activetoday",
      transformResponse: (response) => {
        const res = response.data;
        const tempConfigData = res.config.records;
        const updatedConfig = tempConfigData.map(
          ({ name, defaultVal, tempValue, type, start, end }) => ({
            [name]: {
              tempValue: switchByType(tempValue, type),
              defaultVal: switchByType(defaultVal, type),
              start,
              end,
            },
          })
        );

        let configs = JSON.parse(localStorage.getItem("tempConfigs")) || [];

        for (const item of updatedConfig) {
          const itemName = Object.keys(item)[0]; // Get the name property
          if (configs.some((config) => config.hasOwnProperty(itemName))) {
            const index = configs.findIndex((config) =>
              config.hasOwnProperty(itemName)
            );
            configs[index][itemName] = item[itemName];
          }
        }

        localStorage.setItem("tempConfigs", JSON.stringify(configs));
        return configs;
      },

    }),
    requestApproved: builder.mutation({
      query: ({ id, data }) => ({
        url: `/configs/${id}/approve`,
        method: "POST",
        body: { data },
      }),
    }),
    requestEnded: builder.mutation({
      query: (id) => ({
        url: `/configs/${id}/requestEnded`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useFetchConfigsDataQuery,
  useFetchActiveConfigsDataQuery,
  useRequestApprovedMutation,
  useRequestEndedMutation,
} = tempConfigApiSlice;
export const { setTempConfigs, clearTempConfigs } = tempConfigSlice.actions;
export default tempConfigSlice.reducer;
