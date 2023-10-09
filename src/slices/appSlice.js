import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  themeMode: localStorage.getItem("app")
    ? JSON.parse(localStorage.getItem("app"))?.themeMode
    : "light",
  wb: localStorage.getItem("app")
    ? JSON.parse(localStorage.getItem("app"))?.wb
    : {
        weight: -1,
        lastChange: 0,
        isStable: false,
        onProcessing: false,
        canStartScalling: false,
      },
  configs: localStorage.getItem("configs")
    ? JSON.parse(localStorage.getItem("configs"))
    : null,
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
  userAccess: localStorage.getItem("userAccess")
    ? JSON.parse(localStorage.getItem("userAccess"))
    : null,
  sidebar: localStorage.getItem("sidebar")
    ? JSON.parse(localStorage.getItem("sidebar"))
    : { show: true, unfoldable: false },
  wbTransaction: localStorage.getItem("wbTransaction")
    ? JSON.parse(localStorage.getItem("wbTransaction"))
    : null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setColorMode: (state, action) => {
      state.themeMode = action.payload;

      localStorage.setItem("app", JSON.stringify(state));
    },
    setWb: (state, action) => {
      state.wb = { ...state.wb, ...action.payload };

      localStorage.setItem("app", JSON.stringify(state));
    },
    clearWb: (state, action) => {
      state.wb = {
        weight: -1,
        lastChange: 0,
        isStable: false,
        onProcessing: false,
        canStartScalling: false,
      };

      localStorage.setItem("app", JSON.stringify(state));
    },
    setConfigs: (state, action) => {
      state.configs = { ...state.configs, ...action.payload };
      localStorage.setItem("configs", JSON.stringify(state.configs));
    },
    clearConfigs: (state, action) => {
      state.configs = null;
      localStorage.removeItem("configs");
    },
    setCredentials: (state, action) => {
      const { access, ...rest } = action.payload;
      state.userInfo = rest;
      const userAccess = access.reduce((result, item) => {
        const resource = item.resource;
        const actions = item.grants.map((grant) => grant.action);
        result[resource] = actions;
        return result;
      }, {});
      state.userAccess = userAccess;
      localStorage.setItem("userAccess", JSON.stringify(userAccess));
      localStorage.setItem("userInfo", JSON.stringify(rest));
    },
    clearCredentials: (state, action) => {
      state.userInfo = null;
      state.userAccess = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userAccess");
    },
    setSidebar: (state, action) => {
      state.sidebar = { ...state.sidebar, ...action.payload };
      localStorage.setItem("sidebar", JSON.stringify(state.sidebar));
    },
    clearSidebar: (state, action) => {
      state.sidebar = null;
      localStorage.removeItem("sidebar");
    },
    setWbTransaction: (state, action) => {
      state.wbTransaction = { ...state.wbTransaction, ...action.payload };
      localStorage.setItem(
        "wbTransaction",
        JSON.stringify(state.wbTransaction)
      );
    },
    clearWbTransaction: (state, action) => {
      state.wbTransaction = null;
      localStorage.removeItem("wbTransaction");
    },
  },
});

export const {
  setConfigs,
  clearConfigs,
  setCredentials,
  clearCredentials,
  setSidebar,
  clearSidebar,
  setWb,
  clearWb,
  setWbTransaction,
  clearWbTransaction,
} = appSlice.actions;
export default appSlice.reducer;
