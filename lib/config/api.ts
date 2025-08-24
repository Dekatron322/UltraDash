// API Configuration
type Environment = "STAGING" | "PRODUCTION"

export const API_CONFIG = {
  // Environment-based base URLs
  STAGING: "https://ultra-service-79baffa4bc31.herokuapp.com",
  PRODUCTION: "https://ultra-service-79baffa4bc31.herokuapp.com",

  // Current environment (change this to switch between staging/production)
  CURRENT_ENV: (process.env.NODE_ENV === "production" ? "PRODUCTION" : "STAGING") as Environment,

  // Get current base URL
  get BASE_URL(): string {
    return this[this.CURRENT_ENV]
  },
}

// Centralized API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: "/Admin/Login",
    REFRESH_TOKEN: "/Admin/RefreshToken",
  },

  // User/Customer endpoints
  USERS: {
    OVERVIEW: "/Admin/Users/Overview",
    LIST: "/Admin/Users",
    DETAILS: (id: string | number) => `/Admin/Users/${id}`,
  },

  // Transaction endpoints
  TRANSACTIONS: {
    LIST: "/Admin/Transactions",
    DETAILS: (id: string | number) => `/Admin/Transactions/${id}`,
    CRYPTO: "/Admin/Transactions/Crypto",
    OVERVIEW: "/Admin/Transactions/Overview",
  },

  // Crypto endpoints
  CRYPTO: {
    LIST: "/Admin/Crypto",
    DETAILS: (id: string | number) => `/Admin/Crypto/${id}`,
  },

  // Dashboard endpoints
  DASHBOARD: {
    STATS: "/Admin/Dashboard/Stats",
    ANALYTICS: "/Admin/Dashboard/Analytics",
  },
}

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// Environment switcher utility (for development/testing)
export const switchEnvironment = (env: "STAGING" | "PRODUCTION") => {
  // This would typically be handled by environment variables in a real app
  console.log(`Switching to ${env} environment: ${API_CONFIG[env]}`)
}
