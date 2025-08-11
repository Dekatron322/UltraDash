// src/lib/redux/transactionApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface Status {
  label: string
  value: number
}

export interface Type {
  label: string
  value: number
}

export interface Currency {
  id: number
  name: string
  symbol: string
  ticker: string
  avatar: string
}

export interface Utility {
  isToken: boolean
  token: string | null
  otherField: string | null
  reference: string
}

export interface User {
  id: number
  tag: string
  firstName: string
  lastName: string
  photo: string
  isVerified: boolean
}

export interface VasPayload {
  customerId: string
  billerId: string
  itemId: string
  customerPhone: string
  customerName: string
  otherField: string
  amount: number
}

export interface Sender {
  sender: string
  bankName: string
  accountNumber?: string
  tag?: string
  sessionId?: string
  bankCode?: string
}

export interface Receiver {
  reciever: string
  bankName: string
  accountNumber?: string
  tag?: string
  sessionId?: string | null
  bankCode?: string
}

export interface Transaction {
  id: number
  createdAt: string
  userId: number
  walletId: number
  amount: number
  fee: number
  status: Status
  type: Type
  comment: string
  channel: string
  reference: string
  currency: Currency
  utility: Utility | null
  user: User
  vasPayload: VasPayload | null
  sender: Sender | null
  reciever: Receiver | null
}

export interface CryptoCurrency {
  name: string
  symbol: string
  logo: string
}

export interface QuidaxUser {
  userId: number
  firstName: string
  lastName: string
  display: string | null
}

export interface CryptoTransaction {
  id: number
  fromCurrency: string
  toCurrency: string
  fromAmount: string
  quotedPrice: string
  toAmount: string
  updatedAt: string
  confirmed: boolean
  settled: boolean
  profit: number
  settlementAmount: number
  adjustedQuotedPrice: number
  type: Type
  reference: string
  quidaxUser: QuidaxUser
  from_Currency: CryptoCurrency
  to_Currency: CryptoCurrency
}

export interface TransactionsResponse {
  data: Transaction[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  isSuccess: boolean
  message: string
}

export interface CryptoTransactionsResponse {
  data: CryptoTransaction[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  isSuccess: boolean
  message: string
}

export interface TransactionDetailsResponse {
  data: Transaction[]
  isSuccess: boolean
  message: string
}

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://ultra-service-79baffa4bc31.herokuapp.com/",
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
    getTransactions: builder.query<
      TransactionsResponse,
      {
        pageNumber: number
        pageSize: number
        filterByUserId?: number
        referenceNumber?: string
        type?: number
        startDate?: string
        endDate?: string
      }
    >({
      query: ({ pageNumber, pageSize, filterByUserId, referenceNumber, type, startDate, endDate }) => ({
        url: `Admin/Transactions`,
        params: {
          pageNumber,
          pageSize,
          ...(filterByUserId && { filterByUserId }),
          ...(referenceNumber && { referenceNumber }),
          ...(type && { type }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
        method: "GET",
      }),
    }),
    getCryptoTransactions: builder.query<
      CryptoTransactionsResponse,
      {
        pageNumber: number
        pageSize: number
        filterByUserId?: number
        referenceNumber?: string
        type?: number
        startDate?: string
        endDate?: string
      }
    >({
      query: ({ pageNumber, pageSize, filterByUserId, referenceNumber, type, startDate, endDate }) => ({
        url: `Admin/Crypto/Transactions`,
        params: {
          pageNumber,
          pageSize,
          ...(filterByUserId && { filterByUserId }),
          ...(referenceNumber && { referenceNumber }),
          ...(type && { type }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
        method: "GET",
      }),
    }),
    getTransactionById: builder.query<TransactionDetailsResponse, number>({
      query: (id) => ({
        url: `Admin/Transactions/${id}`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetTransactionsQuery, useGetCryptoTransactionsQuery, useGetTransactionByIdQuery } = transactionApi
