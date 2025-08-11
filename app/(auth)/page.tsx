"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { PasswordInputModule } from "components/ui/Input/PasswordInput"
import { ButtonModule } from "components/ui/Button/Button"
import { FormInputModule } from "components/ui/Input/Input"
import { notify } from "components/ui/Notification/Notification"
import UltraIcon from "public/ultra-icon"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "lib/redux/store"
import { initializeAuth, loginUser } from "lib/redux/authSlice"
import { motion } from "framer-motion"

const SignIn: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { isAuthenticated, user, loading: authLoading } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, user, authLoading, router])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await dispatch(
        loginUser({
          username,
          password,
          appId: "Admin-string",
        })
      ).unwrap()

      console.log("Attempting to show success notification") // Add this
      notify("success", "Login successful!", {
        description: result.message || "Redirecting to dashboard...",
        duration: 3000,
      })

      setTimeout(() => router.push("/dashboard"), 1000)
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again."
      setError(errorMessage)
      notify("error", "Login failed", {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const isButtonDisabled = loading || username.trim() === "" || password.trim() === ""

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e6f0ff]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <UltraIcon className="h-10 w-auto" />
          </motion.div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[#003F9F] shadow-sm ring-1 ring-gray-200"
          >
            English
          </motion.button>
        </header>

        {/* Main Content */}
        <main className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md rounded-2xl p-8 "
          >
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-gray-700">Welcome back</h1>
              <p className="mt-2 text-gray-500">Sign in to your Ultra Admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
                <FormInputModule
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={username}
                  onChange={handleUsernameChange}
                  className="rounded-lg border-gray-300 focus:border-[#003F9F] focus:ring-2 focus:ring-[#003F9F]/50"
                  required
                />
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <PasswordInputModule
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={handlePasswordChange}
                  className="rounded-lg border-gray-300 focus:border-[#003F9F] focus:ring-2 focus:ring-[#003F9F]/50"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="size-4 rounded border-gray-300 text-[#003F9F] focus:ring-[#003F9F]"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Link href="#" className="text-sm font-medium text-[#003F9F] hover:text-[#2F88FC]">
                  Forgot password?
                </Link>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-red-50 p-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.7 }}>
                <ButtonModule
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isButtonDisabled}
                  className="w-full transform rounded-xl py-3 font-medium transition-all hover:scale-[1.01]"
                  whileHover={!isButtonDisabled ? { scale: 1.01 } : {}}
                  whileTap={!isButtonDisabled ? { scale: 0.99 } : {}}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="mr-2 size-5 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </ButtonModule>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 text-center text-sm text-gray-500"
          >
            Don&apos;t have an account?{" "}
            <Link href="#" className="font-medium text-[#003F9F] hover:text-[#2F88FC]">
              Get started
            </Link>
          </motion.div>
        </main>
      </div>
    </div>
  )
}

export default SignIn
