import { createSlice } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";

export const initialTempConfigState = localStorage.getItem("tempConfigs")
  ? Object.assign({}, ...JSON.parse(localStorage.getItem("tempConfigs")))
  : [];

const tempConfigSlice = createSlice({
  name: "tempConfigs",
  initialState: initialTempConfigState,
  reducers: {
    getTempConfigs: (state, action) => {
      if (localStorage.getItem("tempConfigs"))
        state = Object.assign({}, ...JSON.parse(localStorage.getItem("tempConfigs")));
    },
    setTempConfigs: (state, action) => {
      state = action.payload;
      localStorage.setItem("tempConfigs", JSON.stringify(action.payload));
    },
    clearTempConfigs: (state, action) => {
      state = null;
      localStorage.removeItem("tempConfigs");
    },
  },
});

const switchByType = (value, type) => {
  switch (type) {
    case "Number":
      return parseInt(value);
    case "Boolean":
      return value?.toLowerCase?.() === "true";
    case "Json":
      return JSON.parse(JSON.stringify(value));
    default:
      return value;
  }
};

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
      async onQueryUpdated(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {
        dispatch(tempConfigSlice.actions.getTempConfigs());
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

        let configs = JSON.parse(localStorage.getItem("tempConfigs"));
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
      async onQueryFulfilled(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {
        dispatch(tempConfigSlice.actions.getTempConfigs());
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
export const { getTempConfigs, setTempConfigs, clearTempConfigs } =
  tempConfigSlice.actions;
export default tempConfigSlice.reducer;
