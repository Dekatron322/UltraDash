// src/lib/redux/contactSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "./store"
import { API_CONFIG, API_ENDPOINTS } from "lib/config/api"

// Contact Us Interfaces
export interface InquiryType {
  label: string
  value: number
}

export interface ContactUser {
  id: number
  tag: string
  firstName: string
  lastName: string
  photo: string
  isVerified: boolean
}

export interface ContactItem {
  id: number
  createdAt: string
  userId: number
  fullName: string
  email: string
  phoneNumber: string
  inquiryType: InquiryType
  message: string
  attendedTo: boolean
  user: ContactUser
}

export interface ContactListResponse {
  data: ContactItem[]
  totalCount: number
  totalPages: number
  currentPage: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
  isSuccess: boolean
  message: string
}

export interface ContactListParams {
  pageNumber: number
  pageSize: number
}

export interface AttendToRequest {
  contactUsId: number
}

export interface AttendToResponse {
  isSuccess: boolean
  message: string
}

export const contactApi = createApi({
  reducerPath: "contactApi",
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
  tagTypes: ["Contact"],
  endpoints: (builder) => ({
    getContactList: builder.query<ContactListResponse, ContactListParams>({
      query: (params) => {
        const queryParams = new URLSearchParams()
        queryParams.append("pageNumber", params.pageNumber.toString())
        queryParams.append("pageSize", params.pageSize.toString())

        return {
          url: `${API_ENDPOINTS.CONTACT_US.LIST}?${queryParams.toString()}`,
          method: "GET",
        }
      },
      providesTags: ["Contact"],
    }),
    attendToContact: builder.mutation<AttendToResponse, AttendToRequest>({
      query: (body) => ({
        url: API_ENDPOINTS.CONTACT_US.ATTENDTO,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
})

export const { useGetContactListQuery, useAttendToContactMutation } = contactApi
