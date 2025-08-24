// src/lib/redux/overviewSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"
import { API_CONFIG, API_ENDPOINTS } from "lib/config/api"

export interface OverviewData {
  totalUsers: number
  verifiedUsers: number
  verified_Pct: number
  unverifiedUsers: number
  unverified_Pct: number
  banned_Suspended_Users: number
  banned_Suspended_Pct: number
}

export interface OverviewResponse {
  data: OverviewData
  isSuccess: boolean
  message: string
}

export interface TransactionOverviewData {
  today_Start: string
  week_Start_Monday: string
  month_Start: string
  topUp_Today: number
  topUp_Today_Count: number
  topUp_ThisWeek: number
  topUp_ThisWeek_Count: number
  topUp_ThisMonth: number
  topUp_ThisMonth_Count: number
  topUp_AllTime: number
  topUp_AllTime_Count: number
  withdraw_Today: number
  withdraw_Today_Count: number
  withdraw_ThisWeek: number
  withdraw_ThisWeek_Count: number
  withdraw_ThisMonth: number
  withdraw_ThisMonth_Count: number
  withdraw_AllTime: number
  withdraw_AllTime_Count: number
  airtime_Today: number
  airtime_Today_Count: number
  airtime_ThisWeek: number
  airtime_ThisWeek_Count: number
  airtime_ThisMonth: number
  airtime_ThisMonth_Count: number
  airtime_AllTime: number
  airtime_AllTime_Count: number
  internetBundle_Today: number
  internetBundle_Today_Count: number
  internetBundle_ThisWeek: number
  internetBundle_ThisWeek_Count: number
  internetBundle_ThisMonth: number
  internetBundle_ThisMonth_Count: number
  internetBundle_AllTime: number
  internetBundle_AllTime_Count: number
  utility_Today: number
  utility_Today_Count: number
  utility_ThisWeek: number
  utility_ThisWeek_Count: number
  utility_ThisMonth: number
  utility_ThisMonth_Count: number
  utility_AllTime: number
  utility_AllTime_Count: number
  buyCrypto_Today: number
  buyCrypto_Today_Count: number
  buyCrypto_ThisWeek: number
  buyCrypto_ThisWeek_Count: number
  buyCrypto_ThisMonth: number
  buyCrypto_ThisMonth_Count: number
  buyCrypto_AllTime: number
  buyCrypto_AllTime_Count: number
  sellCrypto_Today: number
  sellCrypto_Today_Count: number
  sellCrypto_ThisWeek: number
  sellCrypto_ThisWeek_Count: number
  sellCrypto_ThisMonth: number
  sellCrypto_ThisMonth_Count: number
  sellCrypto_AllTime: number
  sellCrypto_AllTime_Count: number
}

export interface TransactionOverviewResponse {
  data: TransactionOverviewData
  isSuccess: boolean
  message: string
}

export const overviewApi = createApi({
  reducerPath: "overviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState
      const accessToken = state.auth.tokens?.accessToken

      if (accessToken) {
        headers.set("Authorization", `Bearer ${accessToken}`)
      } else {
        const storedAuth = localStorage.getItem("authState")
        if (storedAuth) {
          const parsedAuth = JSON.parse(storedAuth) as { tokens?: { accessToken?: string } }
          if (parsedAuth.tokens?.accessToken) {
            headers.set("Authorization", `Bearer ${parsedAuth.tokens.accessToken}`)
          }
        }
      }

      headers.set("Accept", "application/json")
      headers.set("Content-Type", "application/json")

      return headers
    },
  }),
  endpoints: (builder) => ({
    getOverview: builder.query<OverviewResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.USERS.OVERVIEW,
        method: "GET",
      }),
    }),
    getTransactionOverview: builder.query<TransactionOverviewResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.TRANSACTIONS.OVERVIEW,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetOverviewQuery, useGetTransactionOverviewQuery } = overviewApi
