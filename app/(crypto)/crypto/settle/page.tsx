"use client"
import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { FiArrowLeft, FiDollarSign, FiUser } from "react-icons/fi"
import { ButtonModule } from "components/ui/Button/Button"
import { notify } from "components/ui/Notification/Notification"
import DashboardNav from "components/Navbar/DashboardNav"

interface CryptoAsset {
  symbol: string
  name: string
  amount: number
  valueUSD: number
  allocation: number
  price: number
  change24h: number
  color?: string
}

const TransferToUser: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [amount, setAmount] = useState("")
  const [isValidAmount, setIsValidAmount] = useState(true)
  const [selectedToken, setSelectedToken] = useState<CryptoAsset | null>(null)
  const [recipientName, setRecipientName] = useState("")
  const [verifyingRecipient, setVerifyingRecipient] = useState(false)
  const [activeField, setActiveField] = useState<"amount" | "recipient" | null>(null)

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      try {
        const token = JSON.parse(decodeURIComponent(tokenParam))
        // setSelectedToken({
        //   ...token,
        //   color: token.color || getTokenColor(token.symbol),
        // })
      } catch (e) {
        console.error("Failed to parse token from URL", e)
      }
    }
  }, [searchParams])

  const getTokenColor = (symbol: string) => {
    const colors: Record<string, string> = {
      BTC: "from-amber-500 to-orange-600",
      ETH: "from-indigo-500 to-purple-600",
      USDT: "from-emerald-500 to-teal-600",
      USDC: "from-blue-500 to-cyan-600",
      SOL: "from-green-500 to-lime-600",
      DEFAULT: "from-gray-500 to-gray-600",
    }
    return colors[symbol] || colors.DEFAULT
  }

  const handleGoBack = () => {
    router.back()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedToken) {
      // notify({
      //   type: "error",
      //   title: "No Token Selected",
      //   message: "Please select a token to transfer",
      // })
      return
    }

    if (!recipientName) {
      // notify({
      //   type: "error",
      //   title: "Recipient Required",
      //   message: "Please enter a recipient name",
      // })
      return
    }

    if (!amount) {
      // notify({
      //   type: "error",
      //   title: "Amount Required",
      //   message: "Please enter an amount to transfer",
      // })
      return
    }

    if (!isValidAmount) {
      // notify({
      //   type: "error",
      //   title: "Invalid Amount",
      //   message: "Please enter a valid amount",
      // })
      return
    }

    if (parseFloat(amount) > (selectedToken?.amount || 0)) {
      // notify({
      //   type: "error",
      //   title: "Insufficient Balance",
      //   message: `You don't have enough ${selectedToken.symbol} to complete this transfer`,
      // })
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // notify({
      //   type: "success",
      //   title: "Transfer Initiated!",
      //   message: `${amount} ${selectedToken.symbol} to ${recipientName}`,
      //   duration: 2000,
      // })

      setTimeout(() => router.push("/crypto/verification-code"), 1000)
    } catch (error: any) {
      setError(error.message || "Transfer failed. Please try again.")
      // notify({
      //   type: "error",
      //   title: "Transfer Failed",
      //   message: error.message || "Please try again",
      // })
    } finally {
      setLoading(false)
    }
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value)
      setIsValidAmount(!!value && !isNaN(parseFloat(value)) && parseFloat(value) > 0)
    }
  }

  const handleMaxAmount = () => {
    if (selectedToken) {
      setAmount(selectedToken.amount.toString())
      setIsValidAmount(true)
    }
  }

  const handleRecipientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipientName(value)

    if (value.length >= 3) {
      verifyRecipient(value)
    } else {
      setRecipientName("")
    }
  }

  const verifyRecipient = async (name: string) => {
    setVerifyingRecipient(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUsers: Record<string, string> = {
        john: "John Doe",
        alice: "Alice Smith",
        bob: "Bob Johnson",
        emma: "Emma Wilson",
      }

      const mockUserName = mockUsers[name.toLowerCase()] || name
      setRecipientName(mockUserName)
    } catch (error) {
      setRecipientName("")
    } finally {
      setVerifyingRecipient(false)
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Transfer {selectedToken?.symbol || "Crypto"}</h1>
              <p className="text-gray-500">Send to another user</p>
            </div>
          </div>

          {/* Token Card */}
          {selectedToken && (
            <motion.div
              className={`mb-6 rounded-xl bg-gradient-to-r p-4 ${selectedToken.color} shadow-lg`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {/* <TokenIcon symbol={selectedToken.symbol} className="w-10 h-10 mr-3" /> */}
                  <div>
                    <h3 className="font-medium text-white">{selectedToken.name}</h3>
                    <p className="text-sm text-white/90">
                      Balance: {selectedToken.amount.toFixed(4)} {selectedToken.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${selectedToken.valueUSD.toLocaleString()}</p>
                  <p className={`text-xs ${selectedToken.change24h >= 0 ? "text-green-200" : "text-red-200"}`}>
                    {selectedToken.change24h >= 0 ? "+" : ""}
                    {selectedToken.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Transfer Form */}
          <form onSubmit={handleSubmit}>
            {/* Recipient Field */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">Recipient</label>
              <div
                className={`relative rounded-xl border p-3 transition-all ${
                  activeField === "recipient"
                    ? "border-blue-500 bg-white ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => setActiveField("recipient")}
              >
                <div className="flex items-center">
                  <FiUser className={`mr-2 text-gray-400 ${activeField === "recipient" ? "text-blue-500" : ""}`} />
                  <input
                    type="text"
                    placeholder="Enter recipient name or ID"
                    className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    value={recipientName}
                    onChange={handleRecipientChange}
                    onFocus={() => setActiveField("recipient")}
                    onBlur={() => setActiveField(null)}
                    required
                  />
                  {verifyingRecipient && (
                    <div className="ml-2 size-5 animate-spin">
                      <div className="size-4 rounded-full border-2 border-blue-500 border-t-transparent" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Amount Field */}
            <div className="mb-8">
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                {selectedToken && (
                  <button type="button" onClick={handleMaxAmount} className="text-xs text-blue-600 hover:text-blue-800">
                    Max: {selectedToken.amount.toFixed(4)}
                  </button>
                )}
              </div>
              <div
                className={`relative rounded-xl border p-3 transition-all ${
                  activeField === "amount"
                    ? "border-blue-500 bg-white ring-2 ring-blue-200"
                    : "border-gray-200 bg-gray-50"
                }`}
                onClick={() => setActiveField("amount")}
              >
                <div className="flex items-center">
                  <FiDollarSign className={`mr-2 text-gray-400 ${activeField === "amount" ? "text-blue-500" : ""}`} />
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    className="flex-1 bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                    value={amount}
                    onChange={handleAmountChange}
                    onFocus={() => setActiveField("amount")}
                    onBlur={() => setActiveField(null)}
                    required
                  />
                  {selectedToken && (
                    <div className="ml-2 rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700">
                      {selectedToken.symbol}
                    </div>
                  )}
                </div>
                {!isValidAmount && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-1 text-xs text-red-500"
                  >
                    Please enter a valid amount
                  </motion.p>
                )}
              </div>
            </div>

            {/* Conversion Estimate */}
            {selectedToken && amount && isValidAmount && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-center text-sm text-gray-500"
              >
                ≈ ${(parseFloat(amount) * selectedToken.price).toFixed(2)} USD
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <ButtonModule
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || !recipientName || !amount || !isValidAmount || !selectedToken}
                className="w-full"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Processing...
                  </div>
                ) : (
                  `Transfer ${selectedToken?.symbol || ""}`
                )}
              </ButtonModule>

              <ButtonModule type="button" variant="outline" size="lg" className="w-full" onClick={handleGoBack}>
                Cancel
              </ButtonModule>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default TransferToUser
