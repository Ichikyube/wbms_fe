import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;

const baseQuery = fetchBaseQuery({
  baseUrl: `${REACT_APP_WBMS_BACKEND_API_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("wbms_at");//getState().auth.token; 
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["wbms"],
  endpoints: (builder) => ({}),
});
