// lib/redux/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"
import axios from "axios"

// Interfaces
interface Tokens {
  accessToken: string
  refreshToken: string
  accessExpiry: string
  refreshExpiry: string
}

interface Status {
  value: number
  label: string
}

interface Country {
  id: number
  name: string
  callingCode: string
  abbreviation: string
  currency: null | string
}

interface Permission {
  id: number
  canViewUsers: boolean
  canManageUsers: boolean
  canManageAdmin: boolean
  canViewDashboard: boolean
  canViewTransactions: boolean
  canManageSystemSettings: boolean
}

interface Admin {
  id: number
  isActive: boolean
  permission: Permission
}

interface User {
  id: number
  firstName: string
  lastName: string
  phoneNumber: string
  tag: string
  photo: string
  referralUrl: string
  dob: string
  email: string
  role: string
  status: Status
  isVerified: boolean
  country: Country
  admin: Admin
}

interface LoginResponse {
  tokens: Tokens
  user: User
  message: string
}

interface LoginCredentials {
  username: string
  password: string
  appId: string
}

interface AuthState {
  user: User | null
  tokens: Tokens | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}

// Configure axios instance
export const api = axios.create({
  baseURL: "https://ultra-service-79baffa4bc31.herokuapp.com",
})

// Helper functions for localStorage
const loadAuthState = (): AuthState | undefined => {
  try {
    const serializedState = localStorage.getItem("authState")
    if (serializedState === null) {
      return undefined
    }
    return JSON.parse(serializedState) as AuthState
  } catch (err) {
    console.warn("Failed to load auth state from localStorage", err)
    return undefined
  }
}

const saveAuthState = (state: AuthState) => {
  try {
    const serializedState = JSON.stringify({
      user: state.user,
      tokens: state.tokens,
      isAuthenticated: state.isAuthenticated,
    })
    localStorage.setItem("authState", serializedState)
  } catch (err) {
    console.warn("Failed to save auth state to localStorage", err)
  }
}

// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const authState = loadAuthState()
  if (authState?.tokens?.accessToken) {
    config.headers.Authorization = `Bearer ${authState.tokens.accessToken}`
  }
  return config
})

// Load initial state from localStorage if available
const persistedState = loadAuthState()
const initialState: AuthState = persistedState || {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

export const loginUser = createAsyncThunk("auth/login", async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>("/Admin/Login", credentials)
    return response.data
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue(error.message)
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.tokens = null
      state.isAuthenticated = false
      state.error = null
      state.loading = false
      localStorage.removeItem("authState")
    },
    clearError: (state) => {
      state.error = null
    },
    initializeAuth: (state) => {
      const persistedState = loadAuthState()
      if (persistedState) {
        return { ...state, ...persistedState }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.tokens = action.payload.tokens
        saveAuthState(state)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = (action.payload as string) || "Login failed"
      })
  },
})

export const { logout, clearError, initializeAuth } = authSlice.actions
export default authSlice.reducer
