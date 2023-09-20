import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// import { authSlice } from "./auth";

const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;

// const { setCredentials, clearCredentials, setToken } = authSlice.actions;

const baseQuery = fetchBaseQuery({
  baseUrl: `${REACT_APP_WBMS_BACKEND_API_URL}`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("wbms_at");//api.getState().auth.token; 
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  console.log(result);

  if (result?.error?.status === 401) {
    const { rt } = api.getState().auth;

    // console.log(args);
    // console.log(api);
    // console.log(extraOptions);
    console.log("Sending refresh token.");

    api.dispatch(setToken(rt));

    // send refresh token to get new access token
    const refreshResult = await baseQuery({ url: "/auth/refresh", method: "POST" }, api, extraOptions);

    if (refreshResult?.data) {
      const { data } = refreshResult.data;
      const user = api.getState().auth.user;

      // store the new token
      api.dispatch(setCredentials({ ...data, user }));

      // retry the original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

const apiSlice = createApi({
  baseQuery: baseQuery,
  tagTypes: ["wbms"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
