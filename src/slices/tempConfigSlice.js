import { createContext } from "react";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

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
  extraReducers: (builder) => {
    builder.addCase(fetchActiveConfigsData.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchActiveConfigsData.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.tempConfigDt = action.payload;
    });
    builder.addCase(fetchActiveConfigsData.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    });
  },
});

const switchByType = (value, type) =>
  type === "Number"
    ? parseInt(value)
    : type === "Boolean"
    ? value?.toLowerCase?.() === 'true'
    : type === "Json"
    ? JSON.parse(value)
    : value;

export const fetchConfigsData = createAsyncThunk(
  "tempConfigs/fetchConfigsData",
  async () => {
    const response = await api.get(`/configs`);
    const requests = await response?.data;
    const configItemsData = requests.data.config.records;

    const configItems = configItemsData.map(({ name, defaultVal, type }) => ({
      [name]: switchByType(defaultVal, type),
    }));

    localStorage.setItem("tempConfigs", JSON.stringify(configItems));
    return configItems;
  }
);

export const fetchActiveConfigsData = createAsyncThunk(
  "tempConfigs/fetchActiveConfigsData",
  async () => {
    const response = await api.get(`/configs/activetoday`);
    const requests = await response?.data;
    const tempConfigData = requests.data.config.records;

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
    const configs = JSON.parse(localStorage.getItem("tempConfigs"));
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
  }
);

export const { setTempConfigs, clearTempConfigs } = tempConfigSlice.actions;
export default tempConfigSlice.reducer;
