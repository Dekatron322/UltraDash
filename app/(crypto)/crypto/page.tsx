"use client"
import DashboardNav from "components/Navbar/DashboardNav"
import AccountIcon from "public/accounts-icon"
import { ButtonModule } from "components/ui/Button/Button"
import { useState } from "react"
import { RxCaretSort } from "react-icons/rx"
import AssetDetailModal from "components/ui/Modal/asset-detail-modal"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiAlertCircle, FiArrowDown, FiArrowUp, FiRefreshCw, FiTrendingUp } from "react-icons/fi"
import { useGetMasterAccountQuery, useGetProfitAccountQuery } from "lib/redux/cryptoSlice"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

interface CryptoAsset {
  name: string
  symbol: string
  balance: number
  locked: number
  staked: number
  convertedBalance: number
  referenceCurrency: string
  logo: string
  networks?: {
    id: string
    name: string
    deposits_enabled: boolean
    withdraws_enabled: boolean
  }[]
}

export default function Dashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"master" | "crypto">("master")
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null)
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch crypto accounts data
  const { data: masterData, refetch: refetchMaster, isFetching: isMasterFetching } = useGetMasterAccountQuery()

  const { data: profitData, refetch: refetchProfit, isFetching: isProfitFetching } = useGetProfitAccountQuery()

  const masterAssets = masterData?.data || []
  const profitAssets = profitData?.data || []
  const currentAssets = activeTab === "master" ? masterAssets : profitAssets

  // Sample data for master accounts
  const masterAccounts: PaymentAccount[] = [
    { id: 1, src: AccountIcon, name: "Main Account", balance: "$12,450.00" },
    { id: 2, src: AccountIcon, name: "Savings Account", balance: "$8,720.50" },
    { id: 3, src: AccountIcon, name: "Investment Account", balance: "$24,300.75" },
  ]

  const totalMasterValue = masterAccounts.reduce((sum, account) => {
    const balance = parseFloat(account.balance.replace(/[^0-9.-]+/g, ""))
    return sum + balance
  }, 0)

  const refreshData = () => {
    setIsRefreshing(true)
    Promise.all([refetchMaster(), refetchProfit()]).finally(() => setIsRefreshing(false))
  }

  // Dashboard metrics
  const dashboardMetrics = {
    totalTransactions: 1245,
    totalVolume: 1250000,
    incomingTransactions: 845,
    incomingVolume: 850000,
    outgoingTransactions: 400,
    outgoingVolume: 400000,
    unresolvedTransactions: 12,
    unresolvedVolume: 12000,
  }

  const handleAssetClick = (asset: CryptoAsset) => {
    setSelectedAsset(asset)
    setIsAssetModalOpen(true)
  }

  const handleTransferClick = (asset: CryptoAsset) => {
    router.push(`/crypto/transfer?token=${encodeURIComponent(JSON.stringify(asset))}`)
  }

  const handleSwapClick = () => {
    router.push(`/crypto/swap`)
  }

  const handleSettleClick = (asset: CryptoAsset) => {
    router.push(`/crypto/settle?token=${encodeURIComponent(JSON.stringify(asset))}`)
  }

  const closeAssetModal = () => {
    setIsAssetModalOpen(false)
    setSelectedAsset(null)
  }

  const formatCurrency = (value: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatNativeCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(value)
  }

  const calculateAllocation = (value: number, total: number) => {
    return total > 0 ? (value / total) * 100 : 0
  }

  const totalMasterCryptoValue = masterAssets.reduce((sum, asset) => sum + asset.convertedBalance, 0)
  const totalProfitCryptoValue = profitAssets.reduce((sum, asset) => sum + asset.convertedBalance, 0)
  const currentTotalValue = activeTab === "master" ? totalMasterCryptoValue : totalProfitCryptoValue

  // Skeleton loading component
  const SkeletonRow = () => (
    <tr className="hover:bg-gray-50">
      {[...Array(7)].map((_, i) => (
        <td key={i} className="whitespace-nowrap border-b px-4 py-2">
          <div className="h-6 animate-pulse rounded bg-gray-200"></div>
        </td>
      ))}
    </tr>
  )

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="container mx-auto px-16 py-8 max-sm:my-4 max-sm:px-3 ">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {/* Header and Refresh */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-500">Overview of your accounts and assets</p>
                </div>
                <button
                  onClick={refreshData}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                  disabled={isRefreshing || (activeTab === "master" ? isMasterFetching : isProfitFetching)}
                >
                  <FiRefreshCw
                    className={`size-5 ${
                      isRefreshing || (activeTab === "master" ? isMasterFetching : isProfitFetching)
                        ? "animate-spin"
                        : ""
                    }`}
                  />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Metrics Cards */}
              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Transactions */}
                <motion.div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" whileHover={{ y: -2 }}>
                  <div className="mb-4 flex items-center gap-3 border-b pb-3">
                    <div className="rounded-full bg-blue-100 p-2">
                      <FiTrendingUp className="text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Total Transactions</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardMetrics.totalTransactions.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">All time</p>
                    </div>
                    <p className="text-sm font-medium text-blue-600">{formatCurrency(dashboardMetrics.totalVolume)}</p>
                  </div>
                </motion.div>

                {/* Incoming */}
                <motion.div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" whileHover={{ y: -2 }}>
                  <div className="mb-4 flex items-center gap-3 border-b pb-3">
                    <div className="rounded-full bg-green-100 p-2">
                      <FiArrowDown className="text-green-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Incoming</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardMetrics.incomingTransactions.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">This month</p>
                    </div>
                    <p className="text-sm font-medium text-green-600">
                      {formatCurrency(dashboardMetrics.incomingVolume)}
                    </p>
                  </div>
                </motion.div>

                {/* Outgoing */}
                <motion.div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" whileHover={{ y: -2 }}>
                  <div className="mb-4 flex items-center gap-3 border-b pb-3">
                    <div className="rounded-full bg-red-100 p-2">
                      <FiArrowUp className="text-red-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Outgoing</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardMetrics.outgoingTransactions.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">This month</p>
                    </div>
                    <p className="text-sm font-medium text-red-600">
                      {formatCurrency(dashboardMetrics.outgoingVolume)}
                    </p>
                  </div>
                </motion.div>

                {/* Unresolved */}
                <motion.div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm" whileHover={{ y: -2 }}>
                  <div className="mb-4 flex items-center gap-3 border-b pb-3">
                    <div className="rounded-full bg-yellow-100 p-2">
                      <FiAlertCircle className="text-yellow-600" />
                    </div>
                    <h3 className="font-medium text-gray-900">Unresolved</h3>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {dashboardMetrics.unresolvedTransactions.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">Require attention</p>
                    </div>
                    <p className="text-sm font-medium text-yellow-600">
                      {formatCurrency(dashboardMetrics.unresolvedVolume)}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-sm-my-4 flex w-full gap-6 max-md:flex-col"
            >
              <div className="w-full">
                <div className="mt-8 rounded-lg shadow-sm">
                  <div className="flex border-b">
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeTab === "master" ? "border-b-2 border-[#003f9f] text-[#003f9f]" : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("master")}
                    >
                      Master Account
                    </button>
                    <button
                      className={`px-4 py-2 font-medium ${
                        activeTab === "crypto" ? "border-b-2 border-[#003f9f] text-[#003f9f]" : "text-gray-500"
                      }`}
                      onClick={() => setActiveTab("crypto")}
                    >
                      Profit Account
                    </button>
                  </div>

                  {activeTab === "master" ? (
                    <div className="w-full overflow-x-auto border-l border-r bg-[#FFFFFF]">
                      <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
                        <thead>
                          <tr>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Asset <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Balance <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Value ({masterAssets[0]?.referenceCurrency?.toUpperCase() || "USD"}) <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Allocation <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Locked <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Staked <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Action <RxCaretSort />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isMasterFetching
                            ? [...Array(5)].map((_, i) => <SkeletonRow key={`master-skeleton-${i}`} />)
                            : masterAssets.map((asset) => (
                                <tr key={asset.symbol} className="hover:bg-gray-50">
                                  <td className="whitespace-nowrap border-b px-4 py-2">
                                    <div className="flex items-center">
                                      <img
                                        src={asset.logo}
                                        alt={asset.symbol}
                                        className="size-8 rounded-md"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.onerror = null
                                          target.src = "https://via.placeholder.com/32"
                                        }}
                                      />
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                        <div className="text-sm text-gray-500">{asset.symbol.toUpperCase()}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    {formatNativeCurrency(asset.balance)}
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    {formatCurrency(asset.convertedBalance, asset.referenceCurrency)}
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    <div className="flex items-center">
                                      <div className="mr-2 h-2.5 w-full rounded-full bg-[#E9F0FF]">
                                        <div
                                          className="h-2.5 rounded-full bg-[#003F9F]"
                                          style={{
                                            width: `${calculateAllocation(
                                              asset.convertedBalance,
                                              totalMasterCryptoValue
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span>
                                        {calculateAllocation(asset.convertedBalance, totalMasterCryptoValue).toFixed(1)}
                                        %
                                      </span>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    {formatNativeCurrency(asset.locked)}
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    {formatNativeCurrency(asset.staked)}
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    <div className="flex gap-3">
                                      <ButtonModule
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => handleAssetClick(asset)}
                                      >
                                        View
                                      </ButtonModule>
                                      <ButtonModule
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => handleTransferClick(asset)}
                                      >
                                        Transfer
                                      </ButtonModule>
                                      <ButtonModule
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => handleSwapClick()}
                                      >
                                        Swap
                                      </ButtonModule>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="w-full overflow-x-auto border-l border-r bg-[#FFFFFF]">
                      <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
                        <thead>
                          <tr>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Asset <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Balance <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Value ({profitAssets[0]?.referenceCurrency?.toUpperCase() || "USD"}) <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Allocation <RxCaretSort />
                              </div>
                            </th>
                            <th className="cursor-pointer whitespace-nowrap border-b p-4 text-sm">
                              <div className="flex items-center gap-2">
                                Action <RxCaretSort />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isProfitFetching
                            ? [...Array(5)].map((_, i) => <SkeletonRow key={`profit-skeleton-${i}`} />)
                            : profitAssets.map((asset) => (
                                <tr key={asset.symbol} className="hover:bg-gray-50">
                                  <td className="whitespace-nowrap border-b px-4 py-2">
                                    <div className="flex items-center">
                                      <img
                                        src={asset.logo}
                                        alt={asset.symbol}
                                        className="size-8 rounded-md"
                                        onError={(e) => {
                                          const target = e.target as HTMLImageElement
                                          target.onerror = null
                                          target.src = "https://via.placeholder.com/32"
                                        }}
                                      />
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                                        <div className="text-sm text-gray-500">{asset.symbol.toUpperCase()}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    {formatNativeCurrency(asset.balance)}
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    {formatCurrency(asset.convertedBalance, asset.referenceCurrency)}
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    <div className="flex items-center">
                                      <div className="mr-2 h-2.5 w-full rounded-full bg-[#E9F0FF]">
                                        <div
                                          className="h-2.5 rounded-full bg-[#003F9F]"
                                          style={{
                                            width: `${calculateAllocation(
                                              asset.convertedBalance,
                                              totalProfitCryptoValue
                                            )}%`,
                                          }}
                                        ></div>
                                      </div>
                                      <span>
                                        {calculateAllocation(asset.convertedBalance, totalProfitCryptoValue).toFixed(1)}
                                        %
                                      </span>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                                    <div className="flex gap-3">
                                      <ButtonModule
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => handleAssetClick(asset)}
                                      >
                                        View
                                      </ButtonModule>
                                      <ButtonModule
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-300 hover:bg-gray-50"
                                        onClick={() => handleSettleClick(asset)}
                                      >
                                        Settle
                                      </ButtonModule>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <AssetDetailModal isOpen={isAssetModalOpen} onRequestClose={closeAssetModal} asset={null} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
