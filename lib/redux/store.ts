// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice" // Your existing auth reducer

import { cryptoApi } from "./cryptoSlice"
import { transactionApi } from "./transactionSlice"
import { customerApi } from "./customerSlice"
import { overviewApi } from "./overviewSlice" // Import the new overview API

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [overviewApi.reducerPath]: overviewApi.reducer, // Add overview reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(transactionApi.middleware)
      .concat(cryptoApi.middleware)
      .concat(customerApi.middleware)
      .concat(overviewApi.middleware), // Add overview middleware
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
