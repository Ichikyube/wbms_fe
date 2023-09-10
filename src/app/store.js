import { configureStore } from "@reduxjs/toolkit";

import { appSlice } from "../slices/app";
import { authSlice } from "../slices/auth";
import apiSlice from "../slices/apiSlice";

const store = configureStore({
  reducer: {
    app: appSlice.reducer,
    auth: authSlice.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
