// src/lib/redux/cryptoSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"
import { API_CONFIG, API_ENDPOINTS } from "lib/config/api"

export interface Network {
  id: string
  name: string
  deposits_enabled: boolean
  withdraws_enabled: boolean
}

export interface CryptoAsset {
  name: string
  symbol: string
  balance: number
  locked: number
  staked: number
  convertedBalance: number
  referenceCurrency: string
  logo: string
  networks: Network[]
}

export interface CryptoAccountResponse {
  data: CryptoAsset[]
  base: null
  isSuccess: boolean
  message: string
}

export const cryptoApi = createApi({
  reducerPath: "cryptoApi",
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
    getMasterAccount: builder.query<CryptoAccountResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.CRYPTO.LIST + "/Master",
        method: "GET",
      }),
    }),
    getProfitAccount: builder.query<CryptoAccountResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.CRYPTO.LIST + "/Profit",
        method: "GET",
      }),
    }),
  }),
})

export const { useGetMasterAccountQuery, useGetProfitAccountQuery } = cryptoApi
