import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
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

interface RefreshTokenResponse {
  tokens: {
    accessToken: string
    accessExpiry: string
  }
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
  isRefreshing: boolean
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

// Check if token is expired
const isTokenExpired = (expiryDate: string): boolean => {
  return new Date() >= new Date(expiryDate)
}

// Refresh token function
export const refreshAccessToken = createAsyncThunk("auth/refreshToken", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { auth: AuthState }
    const refreshToken = state.auth.tokens?.refreshToken

    if (!refreshToken) {
      return rejectWithValue("No refresh token available")
    }

    const response = await api.post<RefreshTokenResponse>("/Admin/RefreshToken", {
      refreshToken,
    })

    return response.data
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data)
    }
    return rejectWithValue(error.message)
  }
})

// Track ongoing refresh to prevent multiple simultaneous refresh attempts
let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token!)
    }
  })

  failedQueue = []
}

// Add request interceptor to inject token
api.interceptors.request.use(
  async (config) => {
    const authState = loadAuthState()

    if (authState?.tokens?.accessToken) {
      // Check if access token is expired or expires within 5 minutes
      const expiryTime = new Date(authState.tokens.accessExpiry).getTime()
      const currentTime = new Date().getTime()
      const fiveMinutes = 5 * 60 * 1000

      if (currentTime >= expiryTime - fiveMinutes) {
        // Token is expired or expires soon
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then((token) => {
            config.headers.Authorization = `Bearer ${token}`
            return config
          })
        }

        isRefreshing = true

        try {
          // Check if refresh token is still valid
          if (isTokenExpired(authState.tokens.refreshExpiry)) {
            // Refresh token is also expired, logout user
            localStorage.removeItem("authState")
            window.location.href = "/login"
            return Promise.reject(new Error("Session expired"))
          }

          // Attempt to refresh the token
          const response = await api.post<RefreshTokenResponse>("/Admin/RefreshToken", {
            refreshToken: authState.tokens.refreshToken,
          })

          // Update the stored tokens
          const updatedTokens = {
            ...authState.tokens,
            accessToken: response.data.tokens.accessToken,
            accessExpiry: response.data.tokens.accessExpiry,
          }

          // Save the updated tokens
          const updatedState = {
            ...authState,
            tokens: updatedTokens,
          }
          saveAuthState(updatedState)

          // Process queued requests
          processQueue(null, response.data.tokens.accessToken)

          // Use the new access token
          config.headers.Authorization = `Bearer ${response.data.tokens.accessToken}`
        } catch (error) {
          // Refresh failed, logout user
          console.error("Token refresh failed:", error)
          processQueue(error, null)
          localStorage.removeItem("authState")
          window.location.href = "/login"
          return Promise.reject(error)
        } finally {
          isRefreshing = false
        }
      } else {
        // Token is still valid, use it
        config.headers.Authorization = `Bearer ${authState.tokens.accessToken}`
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const authState = loadAuthState()

      if (authState?.tokens?.refreshToken && !isTokenExpired(authState.tokens.refreshExpiry)) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({
              resolve: (token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(api(originalRequest))
              },
              reject: (error: any) => {
                reject(error)
              },
            })
          })
        }

        isRefreshing = true

        try {
          // Attempt to refresh the token
          const response = await api.post<RefreshTokenResponse>("/Admin/RefreshToken", {
            refreshToken: authState.tokens.refreshToken,
          })

          // Update the stored tokens
          const updatedTokens = {
            ...authState.tokens,
            accessToken: response.data.tokens.accessToken,
            accessExpiry: response.data.tokens.accessExpiry,
          }

          // Save the updated tokens
          const updatedState = {
            ...authState,
            tokens: updatedTokens,
          }
          saveAuthState(updatedState)

          // Process queued requests
          processQueue(null, response.data.tokens.accessToken)

          // Update the authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.tokens.accessToken}`
          return api(originalRequest)
        } catch (refreshError) {
          // Refresh failed, logout user
          console.error("Token refresh failed:", refreshError)
          processQueue(refreshError, null)
          localStorage.removeItem("authState")
          window.location.href = "/login"
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      } else {
        // No valid refresh token, logout user
        localStorage.removeItem("authState")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

// Load initial state from localStorage if available
const persistedState = loadAuthState()
const initialState: AuthState = persistedState || {
  user: null,
  tokens: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  isRefreshing: false,
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
      state.isRefreshing = false
      localStorage.removeItem("authState")
    },
    clearError: (state) => {
      state.error = null
    },
    initializeAuth: (state) => {
      const persistedState = loadAuthState()
      if (persistedState?.tokens) {
        // Check if refresh token is still valid
        if (!isTokenExpired(persistedState.tokens.refreshExpiry)) {
          return { ...state, ...persistedState }
        } else {
          // Refresh token expired, clear auth state
          localStorage.removeItem("authState")
        }
      }
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; accessExpiry: string }>) => {
      if (state.tokens) {
        state.tokens.accessToken = action.payload.accessToken
        state.tokens.accessExpiry = action.payload.accessExpiry
        saveAuthState(state)
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
      .addCase(refreshAccessToken.pending, (state) => {
        state.isRefreshing = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action: PayloadAction<RefreshTokenResponse>) => {
        state.isRefreshing = false
        if (state.tokens) {
          state.tokens.accessToken = action.payload.tokens.accessToken
          state.tokens.accessExpiry = action.payload.tokens.accessExpiry
          saveAuthState(state)
        }
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.isRefreshing = false
        state.error = (action.payload as string) || "Token refresh failed"
        // Optionally logout the user if refresh fails
        state.user = null
        state.tokens = null
        state.isAuthenticated = false
        localStorage.removeItem("authState")
      })
  },
})

export const { logout, clearError, initializeAuth, updateTokens } = authSlice.actions
export default authSlice.reducer
