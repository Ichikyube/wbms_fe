import apiSlice from "./apiSlice";

const API_URL = "/configs";

export const configApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getENV: builder.query({
      query: (data) => ({
        url: `${API_URL}/env`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetENVQuery } = configApiSlice;
