"use client"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { FiAlertCircle, FiArrowLeft, FiCheckCircle, FiClock, FiMail, FiShield } from "react-icons/fi"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import DashboardNav from "components/Navbar/DashboardNav"

interface OtpInputProps {
  value: string
  onChange: (otp: string) => void
  onVerify?: (otp: string) => Promise<boolean>
  length?: number
  className?: string
}

const OtpInputModule: React.FC<OtpInputProps> = ({ value = "", onChange, onVerify, length = 6, className = "" }) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""))
  const [activeInput, setActiveInput] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState(false)
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (value.length === 0) {
      setOtp(Array(length).fill(""))
    }
  }, [value, length])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digit characters

    if (value === "") {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1) // Only take the last character
    setOtp(newOtp)
    setError(false)

    const combinedOtp = newOtp.join("")
    onChange(combinedOtp)

    // Auto focus next input
    if (value && index < length - 1) {
      setActiveInput(index + 1)
      inputRefs.current[index + 1]?.focus()
    }

    // Verify if all fields are filled
    if (combinedOtp.length === length && onVerify) {
      verifyOtp(combinedOtp)
    } else {
      setIsVerified(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1)
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "")
    if (pastedData.length === length) {
      const newOtp = pastedData.split("").slice(0, length)
      setOtp(newOtp)
      onChange(newOtp.join(""))
      if (onVerify) {
        verifyOtp(newOtp.join(""))
      }
      setActiveInput(length - 1)
      inputRefs.current[length - 1]?.focus()
    }
  }

  const verifyOtp = async (otp: string) => {
    setIsVerifying(true)
    try {
      if (onVerify) {
        const isValid = await onVerify(otp)
        setIsVerified(isValid)
        setError(!isValid)
        return isValid
      }
      return false
    } catch (error) {
      setIsVerified(false)
      setError(true)
      return false
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="mb-1 flex justify-center gap-3">
        {Array.from({ length }).map((_, index) => (
          <motion.input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={otp[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={() => setActiveInput(index)}
            initial={{ scale: 1 }}
            animate={{
              scale: activeInput === index ? 1.05 : 1,
              borderColor: error ? "#ef4444" : isVerified ? "#10b981" : activeInput === index ? "#3b82f6" : "#d1d5db",
              boxShadow: activeInput === index ? "0 0 0 3px rgba(59, 130, 246, 0.2)" : "none",
            }}
            transition={{ type: "spring", stiffness: 500 }}
            className={`h-14 w-14 rounded-lg border-2 bg-white text-center text-2xl font-semibold text-gray-800 outline-none transition-all`}
          />
        ))}
      </div>

      <AnimatePresence>
        {(isVerifying || isVerified || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <div className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                <span className="text-sm text-gray-600">Verifying...</span>
              </>
            ) : error ? (
              <>
                <FiAlertCircle className="text-red-500" />
                <span className="text-sm text-red-500">Invalid code</span>
              </>
            ) : (
              <>
                <FiCheckCircle className="text-green-500" />
                <span className="text-sm text-green-600">Verified</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const VerificationCode: React.FC = () => {
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  const [countdown, setCountdown] = useState(59)
  const [resendAttempts, setResendAttempts] = useState(0)

  const router = useRouter()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!isOtpVerified) {
      // notify({
      //   type: "error",
      //   title: "Verification Required",
      //   message: "Please enter and verify the code",
      // })
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // notify({
      //   type: "success",
      //   title: "BVN Verified!",
      //   message: "Your identity has been confirmed",
      //   duration: 2000,
      // })

      setTimeout(() => router.push("/crypto/review"), 1000)
    } catch (error: any) {
      setError(error.message || "Verification failed. Please try again.")
      // notify({
      //   type: "error",
      //   title: "Verification Failed",
      //   message: error.message || "Please try again",
      // })
    } finally {
      setLoading(false)
    }
  }

  const handleOtpVerification = async (otp: string) => {
    // Simple validation - replace with real API call
    const isValid = otp === "123456" // Test code for demo

    if (isValid) {
      setIsOtpVerified(true)
      return true
    } else {
      setIsOtpVerified(false)
      return false
    }
  }

  const handleResendCode = () => {
    if (resendAttempts >= 3) {
      // notify({
      //   type: "error",
      //   title: "Limit Exceeded",
      //   message: "You've reached the maximum resend attempts",
      // })
      return
    }

    setResendAttempts((prev) => prev + 1)
    setCountdown(59)
    setOtp("")
    setIsOtpVerified(false)

    // notify({
    //   type: "info",
    //   title: "New Code Sent",
    //   message: "Check your email for the new verification code",
    // })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav />

      <div className="container mx-auto max-w-md px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="mb-8 flex items-center">
            <button onClick={handleGoBack} className="mr-4 rounded-full p-2 hover:bg-gray-100">
              <FiArrowLeft className="size-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Otp Verification</h1>
              <p className="text-gray-500">Secure identity confirmation</p>
            </div>
          </div>

          {/* Security Info */}
          <motion.div
            className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-blue-100 p-2">
                <FiShield className="text-blue-600" />
              </div>
              <div>
                <h3 className="mb-1 font-medium text-gray-900">Security Code</h3>
                <p className="text-sm text-gray-600">
                  Enter the 6-digit code sent to your registered email and phone number
                </p>
              </div>
            </div>
          </motion.div>

          {/* Verification Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="mb-4 flex items-center gap-2 text-gray-700">
                <FiMail className="text-gray-500" />
                <span className="text-sm">bennymulla@crossfiat.com</span>
              </div>

              <OtpInputModule value={otp} onChange={setOtp} onVerify={handleOtpVerification} />

              <div className="mt-4 text-center">
                {countdown > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <FiClock className="text-gray-400" />
                    <span>Resend code in 00:{countdown.toString().padStart(2, "0")}</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    Didn&apos;t receive code? Resend
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !isOtpVerified}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Verifying...
                  </div>
                ) : (
                  "Confirm Otp"
                )}
              </ButtonModule>

              <ButtonModule type="button" variant="outline" size="lg" className="w-full" onClick={handleGoBack}>
                Cancel
              </ButtonModule>
            </div>
          </form>

          {/* Security Footer */}
          <motion.div
            className="mt-8 text-center text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-center gap-2">
              <FiShield className="text-gray-400" />
              <span>Your information is securely encrypted</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default VerificationCode
