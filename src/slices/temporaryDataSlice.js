import apiSlice from "./apiSlice";

const API_ENDPOINT = "/temporary-data";

export const temporaryDataApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllTransactions: builder.query({
      query: () => `${API_ENDPOINT}/transactions`,
    }),
    insertReqData: builder.mutation({
      query: (data) => ({
        url: `${API_ENDPOINT}/insertReqData`,
        method: "POST",
        body: data,
      }),
    }),
    insertTrxData: builder.mutation({
      query: (data) => ({
        url: `${API_ENDPOINT}/insertTrxData`,
        method: "POST",
        body: data,
      }),
    }),
    insertManyTrxData: builder.mutation({
      query: (data) => ({
        url: `${API_ENDPOINT}/insertManyTrxData`,
        method: "POST",
        body: data,
      }),
    }),
    submitTemporaryData: builder.mutation({
      query: (data) => ({
        url: `${API_ENDPOINT}/submitTemporaryData`,
        method: "POST",
        body: data,
      }),
    }),
    deleteAllTemporaryTransactionsData: builder.mutation({
      query: () => ({
        url: `${API_ENDPOINT}/deleteAllTemporaryTransactionsData`,
        method: "DELETE",
      }),
    }),
    deleteTemporaryTransactionsData: builder.mutation({
      query: (id) => ({
        url: `${API_ENDPOINT}/deleteTemporaryTransactionsData/${id}`,
        method: "DELETE",
      }),
    }),
    deleteAdminRequestData: builder.mutation({
      query: (id) => ({
        url: `${API_ENDPOINT}/deleteAdminRequestData/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllTransactionsQuery,
  useInsertReqDataMutation,
  useInsertTrxDataMutation,
  useInsertManyTrxDataMutation,
  useSubmitTemporaryDataMutation,
  useDeleteAllTemporaryTransactionsDataMutation,
  useDeleteTemporaryTransactionsDataMutation,
  useDeleteAdminRequestDataMutation,
} = temporaryDataApi;
