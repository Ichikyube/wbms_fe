import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
  at: localStorage.getItem("at") ? JSON.parse(localStorage.getItem("at")) : null,
  rt: localStorage.getItem("rt") ? JSON.parse(localStorage.getItem("rt")) : null,
  token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, tokens } = action.payload;

      state.user = user;
      state.at = tokens.access_token;
      state.rt = tokens.refresh_token;
      state.token = tokens.access_token;
      state.roles = [1000, 1001, 1002, 1003];

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("at", JSON.stringify(tokens.access_token));
      localStorage.setItem("rt", JSON.stringify(tokens.refresh_token));
      localStorage.setItem("token", JSON.stringify(tokens.access_token));
    },
    clearCredentials: (state, action) => {
      state.user = null;
      state.at = null;
      state.rt = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("at");
      localStorage.removeItem("rt");
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      const { token } = action.payload;

      state.token = token;
    },
  },
});

// export const { setCredentials, clearCredentials, setToken } = authSlice.actions;
// export default authSlice.reducer;
// export default authSlice;
