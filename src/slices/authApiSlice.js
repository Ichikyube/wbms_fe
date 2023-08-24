import { apiSlice } from "./apiSlice";
import Cookies from "js-cookie";

const API_URL = "/auth";
const token = Cookies.get("at");

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (data) => ({
        url: `${API_URL}/signin`,
        method: "POST",
        body: data,
        mode: "cors",
        credentials: "include",
      }),
    }),
    signout: builder.mutation({
      query: () => ({
        url: `${API_URL}/signout`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        method: "POST",
        mode: "cors",
        credentials: "include",
      }),
    }),
  }),
});

export const { useSigninMutation, useSignoutMutation } = authApiSlice;
