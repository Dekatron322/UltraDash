"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { notify } from "components/ui/Notification/Notification"
import DashboardNav from "components/Navbar/DashboardNav"
import ArrowLeftIcon from "public/arrow-left"
import { FiCheck, FiEdit2, FiInfo, FiX } from "react-icons/fi"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "lib/redux/store"

interface FeeStructure {
  buyingSpread: number
  sellingSpread: number
  transferCommission: number
}

const FeesPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const canManageSystemSettings = user?.admin?.permission?.canManageSystemSettings
  const [isEditing, setIsEditing] = useState({
    buyingSpread: false,
    sellingSpread: false,
    transferCommission: false,
  })

  const [tempFees, setTempFees] = useState<FeeStructure>({
    buyingSpread: 0.5,
    sellingSpread: 0.5,
    transferCommission: 0.1,
  })
  const [fees, setFees] = useState<FeeStructure>({
    buyingSpread: 0.5,
    sellingSpread: 0.5,
    transferCommission: 0.1,
  })

  const router = useRouter()
  const handleEditToggle = (field: keyof FeeStructure) => {
    setIsEditing((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))

    // Reset temp values when opening edit
    if (!isEditing[field]) {
      setTempFees((prev) => ({
        ...prev,
        [field]: fees[field],
      }))
    }
  }

  const handleFeeChange = (field: keyof FeeStructure, value: string) => {
    const numValue = parseFloat(value)
    if (!isNaN(numValue)) {
      setTempFees((prev) => ({
        ...prev,
        [field]: numValue,
      }))
    }
  }

  const handleSave = (field: keyof FeeStructure) => {
    if (tempFees[field] < 0 || tempFees[field] > 100) {
      notify("error", "fialed", {
        description: "errorMessage",
      })
      return
    }

    setFees((prev) => ({
      ...prev,
      [field]: tempFees[field],
    }))
    setIsEditing((prev) => ({
      ...prev,
      [field]: false,
    }))

    notify("success", "Login successful!", {
      description: "Redirecting to dashboard...",
      duration: 3000,
    })
  }

  const FeeCard = ({
    title,
    value,
    field,
    description,
  }: {
    title: string
    value: number
    field: keyof FeeStructure
    description: string
  }) => (
    <motion.div
      className="glass-card rounded-xl border border-white/10 bg-white p-6 shadow-lg backdrop-blur-sm"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="mb-4 text-sm text-gray-500">{description}</p>
        </div>
        {canManageSystemSettings && (
          <button
            onClick={() => handleEditToggle(field as any)}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label={`Edit ${title}`}
          >
            <FiEdit2 className="text-gray-600" />
          </button>
        )}
      </div>

      {isEditing[field] ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            value={tempFees[field]}
            onChange={(e) => handleFeeChange(field, e.target.value)}
            className="w-24 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            step="0.1"
            min="0"
            max="100"
          />
          <span className="text-gray-600">%</span>
          {canManageSystemSettings && (
            <div className="ml-2 flex gap-1">
              <button
                onClick={() => handleSave(field)}
                className="rounded-full p-2 text-green-500 transition-colors hover:bg-green-50"
                aria-label="Save"
              >
                <FiCheck />
              </button>
              <button
                onClick={() => handleEditToggle(field as any)}
                className="rounded-full p-2 text-red-500 transition-colors hover:bg-red-50"
                aria-label="Cancel"
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center">
          <span className="text-3xl font-bold text-gray-800">{value}%</span>
          <div className="ml-2 flex items-center text-sm text-gray-500">
            <FiInfo className="mr-1" />
            {value > 0.5 ? "Higher than average" : "Lower than average"}
          </div>
        </div>
      )}
    </motion.div>
  )

  return (
    <section className="relative flex min-h-screen flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <DashboardNav />
      <div className="flex w-full flex-col items-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="mb-6 flex items-center">
            <button onClick={() => router.back()} className="mr-4 rounded-full p-2 transition-colors hover:bg-gray-100">
              <ArrowLeftIcon className="size-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Transaction Fees</h1>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <FeeCard
              title="Buying Spread"
              value={fees.buyingSpread}
              field="buyingSpread"
              description="Additional percentage added to market price when buying"
            />
            <FeeCard
              title="Selling Spread"
              value={fees.sellingSpread}
              field="sellingSpread"
              description="Percentage deducted from market price when selling"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <FeeCard
              title="Transfer Commission"
              value={fees.transferCommission}
              field="transferCommission"
              description="Fixed percentage fee for transferring assets between accounts"
            />
          </div>

          <motion.div
            className="glass-card mt-6 rounded-xl border border-white/10 bg-white p-6 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="mb-2 text-lg font-semibold text-gray-800">Fee Calculator</h3>
            <p className="mb-4 text-sm text-gray-500">Estimate fees for your transactions</p>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Transaction Type</label>
                <select className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <option>Buy</option>
                  <option>Sell</option>
                  <option>Transfer</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Amount ($)</label>
                <input
                  type="number"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="1000"
                />
              </div>

              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">
                  Estimated Fee: <span className="font-semibold">$5.00</span>
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Total Amount: <span className="font-semibold">$1005.00</span>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeesPage
