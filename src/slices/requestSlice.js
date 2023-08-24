// reducer.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios';

// Define your API base URL
const API_BASE_URL = 'your_api_base_url_here';

// Thunk action to fetch the list of requests
export const fetchRequestList = createAsyncThunk('requests/fetchRequestList', async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requests`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch request list.');
  }
});

const initialState = {
  requestList: [],
  loading: false,
  error: null,
};

const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequestList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequestList.fulfilled, (state, action) => {
        state.loading = false;
        state.requestList = action.payload;
      })
      .addCase(fetchRequestList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default requestSlice.reducer;
// import { ACCEPT_NAME, REJECT_NAME, BLOCK_NAME, UNDO } from "../constants";

// const acceptFunc = (acceptData) => {
//     return {
//         type: ACCEPT_NAME,
//         data: acceptData,
//     };
// };
// const rejectFunc = (rejectData) => {
//     return {
//         type: REJECT_NAME,
//         data: rejectData,
//     };
// };
// const blockFunc = (blockData) => {
//     return {
//         type: BLOCK_NAME,
//         data: blockData,
//     };
// };
// const undoFunc = (undoData) => {
//     return {
//         type: UNDO,
//         data: undoData,
//     };
// };
// export default acceptFunc;
// export { rejectFunc, blockFunc, undoFunc };

// const personStatus = (state = initialState, action) => {
//   // eslint-disable-next-line default-case
//   switch (action.type) {
//       case ACCEPT_NAME:
//           return {
//               Name: [...state.Name.map((items) => {
//                   if (items.id === action.data.id) {
//                       return {
//                           id: items.id,
//                           name: items.name,
//                           status: items.status = 'Accepted'
//                       }
//                   }
//                   return items
//               })]
//           };

//       case REJECT_NAME:
//           return {
//               Name: [...state.Name.map((items) => {
//                   if (items.id === action.data.id) {
//                       return {
//                           id: items.id,
//                           name: items.name,
//                           status: items.status = 'Rejected'
//                       }
//                   }
//                   return items
//               })]
//           };

//       case BLOCK_NAME:
//           return {
//               Name: [...state.Name.map((items) => {
//                   if (items.id === action.data.id) {
//                       return {
//                           id: items.id,
//                           name: items.name,
//                           status: items.status = 'Blocked'
//                       }
//                   }
//                   return items
//               })]
//           };

//       case UNDO:
//           return {
//               Name: [...state.Name.filter((filterItems) => {
//                   if (filterItems.id === action.data.id) {
//                       return {
//                           id: filterItems.id,
//                           name: filterItems.name,
//                           status: filterItems.status = null
//                       }
//                   }
//                   return filterItems
//               })]

//           };

//       default:
//           return state;
//   }
// };
// const requestsSlice = createSlice({
//   name: 'requests',
//   initialState: { entities: [], loading: 'idle' },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(createRequest.pending, (state) => {
//         state.loading = 'loading'
//       })
//       .addCase(createRequest.fulfilled, (state, action) => {
//         state.loading = 'idle'
//         state.entities.push(action.payload)
//       })
//       .addCase(createRequest.rejected, (state) => {
//         state.loading = 'idle'
//       })
//   }
// })
