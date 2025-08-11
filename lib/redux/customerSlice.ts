// src/lib/redux/customerSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"

export interface Status {
  value: number
  label: string
}

export interface IdentityType {
  value: number
  label: string
}

export interface Kyc {
  userId: number
  identityType: IdentityType
  status: Status
  message: string | null
  documentFront: string | null
  approvalDate: string | null
  uploadedDate: string | null
  user: null
}

export interface Currency {
  id: number
  name: string
  symbol: string
  ticker: string
  avatar: string
}

export interface Wallet {
  id: number
  userId: number
  balance: number
  ledgerBalance: number
  currency: Currency
  isLocal: boolean
  hasAccount: boolean
  message: string | null
  account: null
  banks: any[]
}

export interface User {
  id: number
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  tag: string | null
  photo: string | null
  referralUrl: string | null
  dob: string | null
  email: string | null
  role: string
  status: Status
  isVerified: boolean
  isTwoFactorEnabled: boolean
  isPinSet: boolean
  country: string | null
  kyc: Kyc
  wallets: Wallet[]
}

export interface TransactionType {
  label: string
  value: number
}

export interface TransactionUser {
  id: number
  tag: string
  firstName: string | null
  lastName: string | null
  photo: string | null
  isVerified: boolean
}

export interface TransactionSenderReceiver {
  sender?: string
  bankName?: string
  accountNumber?: string
  sessionId?: string | null
  bankCode?: string
  tag?: string
  reciever?: string
}

export interface Transaction {
  id: number
  createdAt: string
  userId: number
  walletId: number
  amount: number
  fee: number
  status: Status
  type: TransactionType
  comment: string
  channel: string
  reference: string
  currency: Currency
  utility: any
  user: TransactionUser
  vasPayload: any
  sender: TransactionSenderReceiver | null
  reciever: TransactionSenderReceiver | null
}

export interface UsersResponse {
  data: User[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  isSuccess: boolean
  message: string
}

export interface UserResponse {
  data: User
  isSuccess: boolean
  message: string
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

export interface BaseCurrency {
  id: number
  name: string
  symbol: string
  ticker: string
  avatar: string
  balance: number
}

export interface UserCryptoResponse {
  data: {
    data: CryptoAsset[]
    base: BaseCurrency[]
    isSuccess: boolean
    message: string
  }
  isSuccess: boolean
  message: string
}

export const customerApi = createApi({
  reducerPath: "customerApi",
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
    getUsers: builder.query<
      UsersResponse,
      {
        pageNumber: number
        pageSize: number
        tag?: string
        email?: string
        phoneNumber?: string
      }
    >({
      query: ({ pageNumber, pageSize, tag, email, phoneNumber }) => ({
        url: `Admin/Users`,
        params: {
          pageNumber,
          pageSize,
          ...(tag && { tag }),
          ...(email && { email }),
          ...(phoneNumber && { phoneNumber }),
        },
        method: "GET",
      }),
    }),
    getUserById: builder.query<UserResponse, number>({
      query: (id) => ({
        url: `Admin/Users/${id}`,
        method: "GET",
      }),
    }),
    getUserTransactions: builder.query<
      TransactionsResponse,
      {
        id: number
        pageNumber: number
        pageSize: number
        type?: number
        startDate?: string
        endDate?: string
      }
    >({
      query: ({ id, pageNumber, pageSize, type, startDate, endDate }) => ({
        url: `Admin/Users/${id}/Transactions`,
        params: {
          pageNumber,
          pageSize,
          ...(type && { type }),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        },
        method: "GET",
      }),
    }),
    getUserCrypto: builder.query<UserCryptoResponse, number>({
      query: (id) => ({
        url: `Admin/Users/Crypto/${id}`,
        method: "GET",
      }),
    }),
  }),
})

export const { useGetUsersQuery, useGetUserByIdQuery, useGetUserTransactionsQuery, useGetUserCryptoQuery } = customerApi
