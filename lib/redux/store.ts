// src/lib/redux/store.ts
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import { contactApi } from "./contactSlice"

import { cryptoApi } from "./cryptoSlice"
import { transactionApi } from "./transactionSlice"
import { customerApi } from "./customerSlice"
import { overviewApi } from "./overviewSlice"
import { adminApi } from "./adminSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [transactionApi.reducerPath]: transactionApi.reducer,
    [cryptoApi.reducerPath]: cryptoApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [overviewApi.reducerPath]: overviewApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(transactionApi.middleware)
      .concat(cryptoApi.middleware)
      .concat(customerApi.middleware)
      .concat(overviewApi.middleware)
      .concat(adminApi.middleware)
      .concat(contactApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
