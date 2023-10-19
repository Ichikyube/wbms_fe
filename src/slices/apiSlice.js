import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "../api/api";
// import { authSlice } from "./auth";
const { REACT_APP_WBMS_BACKEND_API_URL } = process.env;

const baseQuery = fetchBaseQuery({
  baseUrl: `${REACT_APP_WBMS_BACKEND_API_URL}`,
  prepareHeaders: (headers, { getState }) => {
    const token = localStorage.getItem("wbms_at"); //api.getState().auth.token;
    if(!token)  localStorage.clear();
    headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    console.log("Sending refresh token.");
    // send refresh token to get new access token
    const rt = getCookie("rt");
    if(rt) localStorage.clear()
    try {
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh",
          method: "POST",
          mode: "cors",
          credentials: "include",
          body: rt
        },
        api,
        extraOptions
      );
      if (refreshResult?.data.tokens) {
        const at = refreshResult.data.data.tokens["access_token"];
        const rt = refreshResult.data.data.tokens["refresh_token"];
        localStorage.setItem("wbms_at", at);
        document.cookie = "rt=" + rt + "; SameSite=Lax";
        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      } else if(refreshResult?.data.logs.error.status === 403 || localStorage.getItem("wbms_at")) {
        localStorage.clear();
        window.location.reload();
      }
    } catch (_error) {
      return Promise.reject(_error);
    }
  }

  return result;
};

const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: ["wbms"],
  endpoints: (builder) => ({}),
});

export default apiSlice;
