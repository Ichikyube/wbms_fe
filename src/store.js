import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./slices/appSlice";
import wbTransactionReducer from "./slices/wbTransactionSlice";
import { apiSlice } from "./slices/apiSlice";
import selectionModeReducer from "./slices/selectionModeSlice";
import selectedUsersReducer from "./slices/selectedUsersSlice";
import selectedPJ1Reducer from "./slices/selectedPJ1Slice";
import selectedPJ2Reducer from "./slices/selectedPJ2Slice";
import selectedPJ3Reducer from "./slices/selectedPJ3Slice";
import groupMappingReducer from "./slices/groupMappingSlice";

const initialState = {
  selectedUsers: JSON.parse(localStorage.getItem('selectedUsers')) || [],
  selectedPJ1: JSON.parse(localStorage.getItem('selectedPJ1')) || [],
  selectedPJ2: JSON.parse(localStorage.getItem('selectedPJ2')) || [],
  selectedPJ3: JSON.parse(localStorage.getItem('selectedPJ3')) || [],
  groupMapping: JSON.parse(localStorage.getItem('groupMapping')) || {},
};

const store = configureStore({
  reducer: {
    app: appReducer,
    wbTransaction: wbTransactionReducer,
    selectionMode: selectionModeReducer,
    selectedUsers: selectedUsersReducer,
    selectedPJ1: selectedPJ1Reducer,
    selectedPJ2: selectedPJ2Reducer,
    selectedPJ3: selectedPJ3Reducer,
    groupMapping: groupMappingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
