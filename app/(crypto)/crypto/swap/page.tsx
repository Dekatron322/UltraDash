"use client"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FiArrowLeft, FiInfo, FiRefreshCw, FiChevronDown, FiCopy } from "react-icons/fi"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import DashboardNav from "components/Navbar/DashboardNav"
import TokenDropdown from "components/ui/Modal/token-dropdown"

interface Token {
  symbol: string
  icon: React.ReactNode
  name: string
  color: string
}

const tokens: Token[] = [
  { symbol: "NGN", icon: "₦", name: "Naira", color: "bg-green-500" },
  { symbol: "USDT", icon: "$", name: "Tether", color: "bg-blue-500" },
  { symbol: "BTC", icon: "₿", name: "Bitcoin", color: "bg-orange-500" },
  { symbol: "ETH", icon: "Ξ", name: "Ethereum", color: "bg-purple-500" },
]

const SwapScreen: React.FC = () => {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [buyCurrency, setBuyCurrency] = useState<Token>(tokens[0])
  const [receiveCurrency, setReceiveCurrency] = useState<Token>(tokens[1])
  const [showFees, setShowFees] = useState(false)
  const [calculatingFees, setCalculatingFees] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(1500)
  const [isRateRefreshing, setIsRateRefreshing] = useState(false)

  const router = useRouter()

  const handleSwitch = () => {
    const temp = buyCurrency
    setBuyCurrency(receiveCurrency)
    setReceiveCurrency(temp)
    setAmount("")
    setShowFees(false)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, "")
    setAmount(value)

    if (value.trim() === "") {
      setShowFees(false)
      return
    }

    setCalculatingFees(true)
    setTimeout(() => {
      setCalculatingFees(false)
      setShowFees(true)
    }, 800)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      notify({
        type: "success",
        title: "Swap Initiated!",
        message: `Swapping ${amount} ${buyCurrency.symbol} to ${receiveCurrency.symbol}`,
        duration: 2000,
      })

      setTimeout(() => router.push("/swap/confirmation"), 1000)
    } catch (error: any) {
      setError(error.message || "Swap failed. Please try again.")
      notify({
        type: "error",
        title: "Swap Failed",
        message: error.message || "Please try again",
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshExchangeRate = () => {
    setIsRateRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setExchangeRate((prev) => prev + (Math.random() > 0.5 ? 10 : -10))
      setIsRateRefreshing(false)
      notify({
        type: "info",
        title: "Rate Updated",
        message: "Exchange rate refreshed",
        duration: 1000,
      })
    }, 1000)
  }

  const calculateReceiveAmount = () => {
    if (!amount) return ""
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return ""

    if (buyCurrency.symbol === "NGN" && receiveCurrency.symbol === "USDT") {
      return (numAmount / exchangeRate).toFixed(6)
    } else if (buyCurrency.symbol === "USDT" && receiveCurrency.symbol === "NGN") {
      return (numAmount * exchangeRate).toFixed(2)
    }
    return "0" // For other currency pairs
  }

  const calculateFees = () => {
    if (!amount) return { swapFee: 0, networkFee: 0, total: 0 }
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return { swapFee: 0, networkFee: 0, total: 0 }

    const swapFee = numAmount * 0.005 // 0.5% swap fee
    const networkFee = 360 // Fixed network fee in NGN
    return {
      swapFee,
      networkFee,
      total: numAmount + swapFee + (buyCurrency.symbol === "NGN" ? networkFee : 0),
    }
  }

  const fees = calculateFees()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <DashboardNav />

      <div className="container mx-auto max-w-md px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Header */}
          <div className="mb-8 flex items-center">
            <button onClick={() => router.back()} className="mr-4 rounded-full p-2 hover:bg-gray-100">
              <FiArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Swap Tokens</h1>
              <p className="text-gray-500">Instant cryptocurrency exchange</p>
            </div>
          </div>

          {/* Swap Form */}
          <form onSubmit={handleSubmit}>
            {/* You Pay Section */}
            <motion.div
              className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">You Pay</label>
                <div className="text-sm text-gray-500">Balance: {buyCurrency.symbol === "NGN" ? "∞" : "1,234.56"}</div>
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  inputMode="decimal"
                  placeholder="0.0"
                  className="w-full bg-transparent text-3xl font-medium text-gray-900 outline-none"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <TokenDropdown selectedToken={buyCurrency} onSelect={setBuyCurrency} tokens={tokens} />
              </div>
            </motion.div>

            {/* Switch Button */}
            <div className="my-2 flex justify-center">
              <motion.button
                type="button"
                onClick={handleSwitch}
                className="rounded-full border border-gray-200 bg-white p-2 shadow-md hover:bg-gray-50"
                whileTap={{ scale: 0.9 }}
              >
                <FiRefreshCw className="h-5 w-5 text-gray-700" />
              </motion.button>
            </div>

            {/* You Receive Section */}
            <motion.div
              className="mb-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              whileHover={{ y: -2 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">You Receive</label>
                <div className="text-sm text-gray-500">
                  Balance: {receiveCurrency.symbol === "NGN" ? "∞" : "789.01"}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="text"
                  className="w-full bg-transparent text-3xl font-medium text-gray-900 outline-none"
                  value={calculateReceiveAmount()}
                  readOnly
                />
                <TokenDropdown selectedToken={receiveCurrency} onSelect={setReceiveCurrency} tokens={tokens} />
              </div>
            </motion.div>

            {/* Exchange Rate */}
            <div className="mb-6 flex items-center justify-between px-1">
              <div className="text-sm text-gray-600">
                {buyCurrency.symbol}/{receiveCurrency.symbol} Rate
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900">
                  1 {buyCurrency.symbol} = {(buyCurrency.symbol === "NGN" ? 1 / exchangeRate : exchangeRate).toFixed(6)}{" "}
                  {receiveCurrency.symbol}
                </span>
                <button
                  type="button"
                  onClick={refreshExchangeRate}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isRateRefreshing}
                >
                  <FiRefreshCw className={`h-4 w-4 ${isRateRefreshing ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>

            {/* Fees Breakdown */}
            <AnimatePresence>
              {(showFees || calculatingFees) && (
                <motion.div
                  className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="mb-3 font-medium text-gray-900">Transaction Details</h3>

                  {calculatingFees ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                          <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Swap Fee (0.5%)</span>
                        <span className="text-gray-900">
                          {fees.swapFee.toFixed(2)} {buyCurrency.symbol}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Network Fee</span>
                        <span className="text-gray-900">{fees.networkFee} NGN</span>
                      </div>
                      <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 font-medium">
                        <span className="text-gray-700">Total</span>
                        <span className="text-gray-900">
                          {fees.total.toFixed(2)} {buyCurrency.symbol}
                        </span>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Button */}
            <ButtonModule
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !amount.trim()}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Processing...
                </div>
              ) : (
                "Review Swap"
              )}
            </ButtonModule>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default SwapScreen
