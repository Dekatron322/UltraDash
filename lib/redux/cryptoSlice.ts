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

export interface CryptoFee {
  id: number
  name: string
  symbol: string
  logo: string
  isStablecoin: boolean
  buySpread: number
  sellSpread: number
  isSpreadBased: boolean
  buyCommissionPct: number
  buyCommissionCap: number
  sellCommissionPct: number
  sellCommissionCap: number
}

export interface CryptoFeesResponse {
  data: CryptoFee[]
  isSuccess: boolean
  message: string
}

export interface EditCryptoFeeRequest {
  id: number
  buySpread: number
  sellSpread: number
  isSpreadBased: boolean
  buyCommissionPct: number
  buyCommissionCap: number
  sellCommissionPct: number
  sellCommissionCap: number
}

export interface EditCryptoFeeResponse {
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
  tagTypes: ["CryptoFees"],
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
    getCryptoFees: builder.query<CryptoFeesResponse, void>({
      query: () => ({
        url: API_ENDPOINTS.FEES.CRYPTO_FEES,
        method: "GET",
      }),
      providesTags: ["CryptoFees"],
    }),
    editCryptoFee: builder.mutation<EditCryptoFeeResponse, EditCryptoFeeRequest>({
      query: (feeData) => ({
        url: API_ENDPOINTS.FEES.EDIT_CRYPTO_FEES,
        method: "POST",
        body: feeData,
      }),
      invalidatesTags: ["CryptoFees"],
    }),
  }),
})

export const { useGetMasterAccountQuery, useGetProfitAccountQuery, useGetCryptoFeesQuery, useEditCryptoFeeMutation } =
  cryptoApi
