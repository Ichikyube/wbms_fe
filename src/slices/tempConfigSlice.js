import { createSlice } from "@reduxjs/toolkit";
import apiSlice from "./apiSlice";

export const initialTempConfigState = localStorage.getItem("tempConfigs")
  ? JSON.parse(localStorage.getItem("tempConfigs"))
  : [
      { zeroLock: 0 },
      {
        trxGradingPencentage:
          '{"trxGradingBMPERSEN":2.8,"trxGradingBLMPERSEN":0.2,"trxGradingTPPesen":0.3,"trxGradingSAMPAHPERSEN":1.1,"trxGradingAIRPERSEN":2,"trxGradingLAINNYAPERSEN":0.4,"trxGradingWAJIB":0.9}',
      },
      { stableLock: 3000 },
      {
        potonganTangkaiPanjang:
          "trxGradingTPPERSENValidate(\n            trxGradingTPPesen: number,\n            qtyTbs: number,\n            adTransactionMILL_ID: string,\n            originWeighInKg: number,\n            originWeighOutKg: number,\n          ): number {\n            let persentp: number = 0;\n            const weightnetto = originWeighInKg - originWeighOutKg;\n            if (trxGradingTPPesen !== null) {\n              if (qtyTbs === 0 || qtyTbs === null) {\n                // Display an error message (you can handle this as needed)\n                console.error('Jumlah janjang 0 atau tidak ada.');\n              } else {\n                persentp = (trxGradingTPPesen / qtyTbs) * 100;\n          \n                if (adTransactionMILL_ID === 'BA41') {\n                  return Math.round((persentp * weightnetto) / 100);\n                }\n          \n                if (adTransactionMILL_ID === 'BN41') {\n                  return Math.round((persentp * (1 / 100) * weightnetto) / 100);\n                }\n              }\n            }\n          \n            // Return 0 if none of the conditions are met\n            return 0;\n          }\n          ",
      },
      { potonganTandanKosong: "" },
      {
        potonganSampah:
          "trxGradingSAMPAHPERSENValidate(\n            trxGradingSAMPAHPERSEN: number,\n            originWeighInKg: number,\n            originWeighOutKg: number,\n            adTransactionMILLID: string,\n          ): number {\n            let trxGradingSAMPAHKG = 0;\n            const weightnetto = originWeighInKg - originWeighOutKg;\n            if (trxGradingSAMPAHPERSEN !== null) {\n              trxGradingSAMPAHKG = Math.round(\n                (trxGradingSAMPAHPERSEN / weightnetto) * 100,\n              );\n            }\n          \n            if (adTransactionMILLID === 'BA4l' || adTransactionMILLID === 'BN41') {\n              trxGradingSAMPAHKG = 2 * trxGradingSAMPAHPERSEN;\n            }\n          \n            return trxGradingSAMPAHKG;\n          }",
      },
      { potonganParteno: "" },
      {
        potonganLainnya:
          "trxGradingLAINNYAPERSENValidate(\n            trxGradingLAINNYAPERSEN: number,\n            originWeighInKg: number,\n            originWeighOutKg: number,\n            adTransactionMILL_ID: string,\n          ): number {\n            const weightnetto = originWeighInKg - originWeighOutKg;\n            if (trxGradingLAINNYAPERSEN !== null) {\n              let trxGradingLATNNYAKG = Math.round(\n                (trxGradingLAINNYAPERSEN * weightnetto) / 100,\n              );\n          \n              if (adTransactionMILL_ID === 'AN41') {\n                trxGradingLATNNYAKG = Math.round(\n                  (trxGradingLAINNYAPERSEN / 100) * weightnetto,\n                );\n              }\n          \n              return trxGradingLATNNYAKG;\n            }\n          \n            // Return 0 if trxGradingLAINNYAPERSEN is null\n            return 0;\n          }\n          ",
      },
      {
        potonganBuahMentah:
          "trxGradingBMPERSENValidate(\n            trxGradingBMPERSEN: number,\n            qtyTbs: number,\n            adTransactionMILL_ID: string,\n            originWeighInKg: number,\n            originWeighOutKg: number,\n          ): number {\n            let persenbm: number;\n            let trxGradingBMKG: number = 0;\n            const weightnetto = originWeighInKg - originWeighOutKg;\n            if (trxGradingBMPERSEN !== null) {\n              if (qtyTbs === 0 || qtyTbs === null) {\n                // Display an error message (you can handle this as needed)\n                console.error('Jumlah janjang 0 atau tidak ada.');\n                persenbm = 0;\n              } else {\n                persenbm = trxGradingBMPERSEN / qtyTbs;\n              }\n          \n              if (adTransactionMILL_ID === 'BA41') {\n                trxGradingBMKG = Math.round((persenbm * weightnetto) / 100);\n              }\n          \n              if (adTransactionMILL_ID === 'BN41') {\n                trxGradingBMKG = Math.round(persenbm * weightnetto * 0.5);\n              }\n            }\n          \n            // Return the relevant value based on your logic\n            // For example, you might want to return trxGradingBMKG or trxGradingBMKG\n            return trxGradingBMKG; // or return trxGradingBMKG;\n          }",
      },
      {
        potonganBuahlewatMatang:
          "trxGradingBLMPERSENValidate(\n            trxGradingBLMPERSEN: number,\n            qtyTbs: number,\n            adTransactionMILL_ID: string,\n            originWeighInKg: number,\n            originWeighOutKg: number,\n            persentasiTangkaiPanjang: number,\n          ): number {\n            let persemblm: number = 0;\n            const weightnetto = originWeighInKg - originWeighOutKg;\n            if (trxGradingBLMPERSEN !== null) {\n              if (qtyTbs === 0 || qtyTbs === null) {\n                // Display an error message (you can handle this as needed)\n                console.error('Jumlah janjang 0 atau tidak ada.');\n              } else {\n                persemblm = trxGradingBLMPERSEN / qtyTbs;\n          \n                if (adTransactionMILL_ID === 'BA41') {\n                  return Math.round((persemblm * weightnetto) / 100);\n                }\n          \n                if (adTransactionMILL_ID === 'BN41') {\n                  persemblm *= 100;\n          \n                  if (persemblm >= 5) {\n                    return Math.round(((25 / 100) * (persemblm - 5) * weightnetto) / 100);\n                  } else {\n                    return 0;\n                  }\n                }\n              }\n            }\n          \n            // Return 0 if none of the conditions are met\n            return 0;\n          }",
      },
      { potonganBrondolan: "" },
      {
        potonganAir:
          "trxGradingAIRPERSENValidate(\n            trxGradingAIRPERSEN: number,\n            originWeighInKg: number,\n            originWeighOutKg: number,\n          ): number {\n            const weightnetto = originWeighInKg - originWeighOutKg;\n            if (trxGradingAIRPERSEN !== null) {\n              return Math.round((trxGradingAIRPERSEN * weightnetto) / 100);\n            }\n            return 0; // Return 0 if trxGradingAIRPERSEN is null\n          }\n          ",
      },
      { manualEntryWB: false },
      { editTransaction: false },
      { backDatedTemplate: false },
      { backDatedForm: false },
    ];

const tempConfigSlice = createSlice({
  name: "tempConfigs",
  initialState: initialTempConfigState,
  reducers: {
    getTempConfigs: (state, action) => {
      if (localStorage.getItem("tempConfigs"))
        state = JSON.parse(localStorage.getItem("tempConfigs"));
    },
    setTempConfigs: (state, action) => {
      state = action.payload;
      localStorage.setItem("tempConfigs", JSON.stringify(action.payload));
    },
    clearTempConfigs: (state, action) => {
      state = null;
      localStorage.removeItem("tempConfigs");
    },
  },
});

const switchByType = (value, type) => {
  switch (type) {
    case "Number":
      return parseInt(value);
    case "Boolean":
      return value?.toLowerCase?.() === "true";
    case "Json":
      return JSON.parse(JSON.stringify(value));
    default:
      return value;
  }
};

export const tempConfigApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchConfigsData: builder.query({
      query: () => "/configs",
      transformResponse: (response) => {
        const res = response.data;
        const configItemsData = res.config.records;
        const configItems = configItemsData.map(
          ({ name, defaultVal, type }) => ({
            [name]: switchByType(defaultVal, type),
          })
        );
        localStorage.setItem("tempConfigs", JSON.stringify(configItems));
        return configItems;
      },
      async onQueryUpdated(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {
        dispatch(tempConfigSlice.actions.getTempConfigs());
      },
    }),
    fetchActiveConfigsData: builder.query({
      query: () => "/configs/activetoday",
      transformResponse: (response) => {
        const res = response.data;
        const tempConfigData = res.config.records;
        const updatedConfig = tempConfigData.map(
          ({ name, defaultVal, tempValue, type, start, end }) => ({
            [name]: {
              tempValue: switchByType(tempValue, type),
              defaultVal: switchByType(defaultVal, type),
              start,
              end,
            },
          })
        );

        let configs = JSON.parse(localStorage.getItem("tempConfigs"));
        for (const item of updatedConfig) {
          const itemName = Object.keys(item)[0]; // Get the name property
          if (configs.some((config) => config.hasOwnProperty(itemName))) {
            const index = configs.findIndex((config) =>
              config.hasOwnProperty(itemName)
            );
            configs[index][itemName] = item[itemName];
          }
        }
        localStorage.setItem("tempConfigs", JSON.stringify(configs));
        return configs;
      },
      async onQueryFulfilled(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          cacheEntryRemoved,
          cacheDataLoaded,
          getCacheEntry,
        }
      ) {
        dispatch(tempConfigSlice.actions.getTempConfigs());
      },
    }),
    requestApproved: builder.mutation({
      query: ({ id, data }) => ({
        url: `/configs/${id}/approve`,
        method: "POST",
        body: { data },
      }),
    }),
    requestEnded: builder.mutation({
      query: (id) => ({
        url: `/configs/${id}/requestEnded`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useFetchConfigsDataQuery,
  useFetchActiveConfigsDataQuery,
  useRequestApprovedMutation,
  useRequestEndedMutation,
} = tempConfigApiSlice;
export const { getTempConfigs, setTempConfigs, clearTempConfigs } =
  tempConfigSlice.actions;
export default tempConfigSlice.reducer;
