import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query/react';
import logger from 'redux-logger'
import appReducer from "./slices/appSlice";
import wbTransactionReducer from "./slices/wbTransactionSlice";
import { apiSlice } from "./slices/apiSlice";
import selectionModeReducer from "./slices/selectionModeSlice";
import groupMappingReducer from "./slices/groupMappingSlice";
import requestConfigreducer from "./slices/requestConfigsSlice";
import notificationReducer from './slices/notificationSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    wbTransaction: wbTransactionReducer,
    selectionMode: selectionModeReducer,
    groupMapping: groupMappingReducer,
    requestConfigs: requestConfigreducer,
    notifications: notificationReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, logger),
  devTools: true,
});

// Configure listeners for background polling and cache invalidation
setupListeners(store.dispatch);
export default store;
