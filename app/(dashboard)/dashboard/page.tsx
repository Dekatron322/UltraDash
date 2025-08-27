"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import TotalAssets from "public/total-assets"
import TransactionIcon from "public/transaction-icon"
import AccountIcon from "public/accounts-icon"
import WarningIcon from "public/warning-icon"
import CustomerIcon from "public/customer-icon"
import { ButtonModule } from "components/ui/Button/Button"
import InsightIcon from "public/insight-icon"
import { TransactionChart } from "components/Dashboard/TransactionChart"
import { ProfitChart } from "components/Dashboard/ProfitChart"
import { UserGrowthChart } from "components/Dashboard/UserGrowthChart"
import { AssetDistributionChart } from "components/Dashboard/AssetDistributionChart"
import { AccountDistributionChart } from "components/Dashboard/AccountDistributionChart"
import {
  useGetCurrenciesQuery,
  useGetCustomerBalanceQuery,
  useGetOverviewQuery,
  useGetTransactionOverviewQuery,
  useGetCryptoOverviewQuery,
} from "lib/redux/overviewSlice"
import { useEffect, useState } from "react"

export interface CustomerBalanceResponse {
  data: {
    totalBalance: number
  }
  isSuccess: boolean
  message: string
}

// Time filter types
type TimeFilter = "day" | "week" | "month" | "all"

export default function Dashboard() {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number>(1)
  const [customerBalance, setCustomerBalance] = useState<string>("0")
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("NGN")
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all")

  // API calls
  const { data: currenciesData, isLoading: currenciesLoading } = useGetCurrenciesQuery()
  const { data: overviewData, isLoading: overviewLoading } = useGetOverviewQuery()
  const { data: transactionOverviewData, isLoading: transactionOverviewLoading } = useGetTransactionOverviewQuery()
  const { data: cryptoOverviewData, isLoading: cryptoOverviewLoading } = useGetCryptoOverviewQuery()

  const {
    data: balanceData,
    isLoading: balanceLoading,
    refetch,
  } = useGetCustomerBalanceQuery({ currencyId: selectedCurrencyId }, { skip: !selectedCurrencyId })

  useEffect(() => {
    if (balanceData?.data) {
      try {
        if (Array.isArray(balanceData.data)) {
          const totalBalance = balanceData.data.reduce((sum: number, currency: any) => sum + (currency.balance || 0), 0)
          setCustomerBalance(totalBalance.toLocaleString())
        } else if (typeof balanceData.data === "object" && "totalBalance" in balanceData.data) {
          setCustomerBalance((balanceData.data as any).totalBalance.toLocaleString())
        } else {
          setCustomerBalance("0")
        }
      } catch (error) {
        console.error("Error processing balance data:", error)
        setCustomerBalance("0")
      }
    } else {
      setCustomerBalance("0")
    }
  }, [balanceData])

  useEffect(() => {
    if (currenciesData?.data) {
      const selectedCurrency = currenciesData.data.find((currency) => currency.id === selectedCurrencyId)
      if (selectedCurrency) {
        setSelectedCurrencySymbol(selectedCurrency.symbol)
      }
    }
  }, [selectedCurrencyId, currenciesData])

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrencyId = Number(event.target.value)
    setSelectedCurrencyId(newCurrencyId)
  }

  const handleTimeFilterChange = (filter: TimeFilter) => {
    setTimeFilter(filter)
  }

  // Calculate transaction metrics based on time filter
  const getTransactionData = () => {
    if (!transactionOverviewData?.data) {
      return {
        count: 24568,
        amount: 2456800,
        avgTransactionSize: 100.0, // 2456800 / 24568 ≈ 100
        cryptoCount: 12780,
        fiatCount: 11788,
        cryptoRatio: 52,
        fiatRatio: 48,
        trendValue: "8.3%",
        trendPositive: true,
      }
    }

    const data = transactionOverviewData.data
    let count = 0
    let amount = 0
    let cryptoCount = 0
    let fiatCount = 0

    switch (timeFilter) {
      case "day":
        count =
          (data.topUp_Today_Count || 0) +
          (data.withdraw_Today_Count || 0) +
          (data.airtime_Today_Count || 0) +
          (data.internetBundle_Today_Count || 0) +
          (data.utility_Today_Count || 0) +
          (data.buyCrypto_Today_Count || 0) +
          (data.sellCrypto_Today_Count || 0)

        amount =
          (data.topUp_Today || 0) +
          (data.withdraw_Today || 0) +
          (data.airtime_Today || 0) +
          (data.internetBundle_Today || 0) +
          (data.utility_Today || 0) +
          (data.buyCrypto_Today || 0) +
          (data.sellCrypto_Today || 0)

        cryptoCount = (data.buyCrypto_Today_Count || 0) + (data.sellCrypto_Today_Count || 0)
        fiatCount = count - cryptoCount
        break

      case "week":
        count =
          (data.topUp_ThisWeek_Count || 0) +
          (data.withdraw_ThisWeek_Count || 0) +
          (data.airtime_ThisWeek_Count || 0) +
          (data.internetBundle_ThisWeek_Count || 0) +
          (data.utility_ThisWeek_Count || 0) +
          (data.buyCrypto_ThisWeek_Count || 0) +
          (data.sellCrypto_ThisWeek_Count || 0)

        amount =
          (data.topUp_ThisWeek || 0) +
          (data.withdraw_ThisWeek || 0) +
          (data.airtime_ThisWeek || 0) +
          (data.internetBundle_ThisWeek || 0) +
          (data.utility_ThisWeek || 0) +
          (data.buyCrypto_ThisWeek || 0) +
          (data.sellCrypto_ThisWeek || 0)

        cryptoCount = (data.buyCrypto_ThisWeek_Count || 0) + (data.sellCrypto_ThisWeek_Count || 0)
        fiatCount = count - cryptoCount
        break

      case "month":
        count =
          (data.topUp_ThisMonth_Count || 0) +
          (data.withdraw_ThisMonth_Count || 0) +
          (data.airtime_ThisMonth_Count || 0) +
          (data.internetBundle_ThisMonth_Count || 0) +
          (data.utility_ThisMonth_Count || 0) +
          (data.buyCrypto_ThisMonth_Count || 0) +
          (data.sellCrypto_ThisMonth_Count || 0)

        amount =
          (data.topUp_ThisMonth || 0) +
          (data.withdraw_ThisMonth || 0) +
          (data.airtime_ThisMonth || 0) +
          (data.internetBundle_ThisMonth || 0) +
          (data.utility_ThisMonth || 0) +
          (data.buyCrypto_ThisMonth || 0) +
          (data.sellCrypto_ThisMonth || 0)

        cryptoCount = (data.buyCrypto_ThisMonth_Count || 0) + (data.sellCrypto_ThisMonth_Count || 0)
        fiatCount = count - cryptoCount
        break

      default: // all time
        count =
          (data.topUp_AllTime_Count || 0) +
          (data.withdraw_AllTime_Count || 0) +
          (data.airtime_AllTime_Count || 0) +
          (data.internetBundle_AllTime_Count || 0) +
          (data.utility_AllTime_Count || 0) +
          (data.buyCrypto_AllTime_Count || 0) +
          (data.sellCrypto_AllTime_Count || 0)

        amount =
          (data.topUp_AllTime || 0) +
          (data.withdraw_AllTime || 0) +
          (data.airtime_AllTime || 0) +
          (data.internetBundle_AllTime || 0) +
          (data.utility_AllTime || 0) +
          (data.buyCrypto_AllTime || 0) +
          (data.sellCrypto_AllTime || 0)

        cryptoCount = (data.buyCrypto_AllTime_Count || 0) + (data.sellCrypto_AllTime_Count || 0)
        fiatCount = count - cryptoCount
        break
    }

    const avgTransactionSize = count > 0 ? amount / count : 0
    const cryptoRatio = count > 0 ? Math.round((cryptoCount / count) * 100) : 52
    const fiatRatio = 100 - cryptoRatio

    // Simple trend calculation (in a real app, you'd compare with previous period)
    const trendValue =
      timeFilter === "day" ? "2.1%" : timeFilter === "week" ? "5.7%" : timeFilter === "month" ? "8.3%" : "12.5%"

    const trendPositive = !(timeFilter === "day" && trendValue === "2.1%") // Example logic

    return {
      count,
      amount,
      avgTransactionSize,
      cryptoCount,
      fiatCount,
      cryptoRatio,
      fiatRatio,
      trendValue,
      trendPositive,
    }
  }

  const transactionMetrics = getTransactionData()

  // Get user metrics based on time filter
  const getUserMetrics = () => {
    if (!overviewData?.data) {
      return {
        totalUsers: 4201,
        newUsers: timeFilter === "day" ? 42 : timeFilter === "week" ? 285 : timeFilter === "month" ? 892 : 4201,
        trendValue: "15.2%",
        trendPositive: true,
      }
    }

    const data = overviewData.data
    let newUsers = 0

    // This is a simplified calculation - in a real app, you'd have actual time-based user data
    switch (timeFilter) {
      case "day":
        newUsers = Math.round(data.verifiedUsers * 0.01)
        break
      case "week":
        newUsers = Math.round(data.verifiedUsers * 0.07)
        break
      case "month":
        newUsers = Math.round(data.verifiedUsers * 0.2)
        break
      default: // all time
        newUsers = data.verifiedUsers
        break
    }

    // Simple trend calculation
    const trendValue =
      timeFilter === "day" ? "1.8%" : timeFilter === "week" ? "7.2%" : timeFilter === "month" ? "15.2%" : "28.5%"

    const trendPositive = true

    return {
      totalUsers: data.totalUsers,
      newUsers,
      trendValue,
      trendPositive,
    }
  }

  const userMetrics = getUserMetrics()

  // Chart data based on time filter
  const getChartData = () => {
    // In a real app, you would fetch time-filtered chart data from the API
    // For now, we'll adjust the demo data based on the selected time filter
    const multiplier = timeFilter === "day" ? 0.1 : timeFilter === "week" ? 0.5 : timeFilter === "month" ? 1 : 2.5

    const baseTransactionData = [
      { month: "Jan", crypto: 1200, fiat: 1800 },
      { month: "Feb", crypto: 1900, fiat: 2100 },
      { month: "Mar", crypto: 1500, fiat: 1700 },
      { month: "Apr", crypto: 2200, fiat: 2500 },
      { month: "May", crypto: 2800, fiat: 2300 },
      { month: "Jun", crypto: 3100, fiat: 2900 },
    ]

    const baseProfitData = [
      { month: "Jan", profit: 450 },
      { month: "Feb", profit: 620 },
      { month: "Mar", profit: 500 },
      { month: "Apr", profit: 780 },
      { month: "May", profit: 920 },
      { month: "Jun", profit: 1050 },
    ]

    const baseUserGrowthData = [
      { month: "Jan", users: 1200 },
      { month: "Feb", users: 1850 },
      { month: "Mar", users: 2200 },
      { month: "Apr", users: 2800 },
      { month: "May", users: 3500 },
      { month: "Jun", users: 4200 },
    ]

    return {
      transactionData: baseTransactionData.map((item) => ({
        ...item,
        crypto: Math.round(item.crypto * multiplier),
        fiat: Math.round(item.fiat * multiplier),
      })),
      profitData: baseProfitData.map((item) => ({
        ...item,
        profit: Math.round(item.profit * multiplier),
      })),
      userGrowthData: baseUserGrowthData.map((item) => ({
        ...item,
        users: Math.round(item.users * multiplier),
      })),
    }
  }

  const { transactionData, profitData, userGrowthData } = getChartData()

  const assetDistribution = [
    { name: "BTC", value: 35 },
    { name: "ETH", value: 25 },
    { name: "USDT", value: 15 },
    { name: "Other Crypto", value: 10 },
    { name: "USD", value: 10 },
    { name: "EUR", value: 5 },
  ]

  const accountTypes = [
    {
      name: "Master",
      value: cryptoOverviewData?.data?.master
        ? (cryptoOverviewData.data.master / cryptoOverviewData.data.total) * 100
        : 60,
    },
    {
      name: "Profit",
      value: cryptoOverviewData?.data?.profit
        ? (cryptoOverviewData.data.profit / cryptoOverviewData.data.total) * 100
        : 30,
    },
    {
      name: "User",
      value: cryptoOverviewData?.data?.total
        ? ((cryptoOverviewData.data.total - cryptoOverviewData.data.master - cryptoOverviewData.data.profit) /
            cryptoOverviewData.data.total) *
          100
        : 10,
    },
  ]

  const paymentAccounts = [
    {
      id: 1,
      src: AccountIcon,
      name: "Master Account",
      balance: cryptoOverviewData?.data?.master ? `$${cryptoOverviewData.data.master.toLocaleString()}` : "$125,000",
    },
    {
      id: 2,
      src: AccountIcon,
      name: "Profit Account",
      balance: cryptoOverviewData?.data?.profit ? `$${cryptoOverviewData.data.profit.toLocaleString()}` : "$42,500",
    },
    {
      id: 3,
      src: AccountIcon,
      name: "User Funds",
      balance: cryptoOverviewData?.data?.total
        ? `$${(
            cryptoOverviewData.data.total -
            cryptoOverviewData.data.master -
            cryptoOverviewData.data.profit
          ).toLocaleString()}`
        : "$892,300",
    },
  ]

  const Card = ({
    children,
    className = "",
    title,
  }: {
    children: React.ReactNode
    className?: string
    title?: string
  }) => (
    <div className={`rounded-xl bg-white p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>}
      {children}
    </div>
  )

  const Metric = ({ children }: { children: React.ReactNode }) => (
    <p className="flex items-end gap-2 text-3xl font-bold text-gray-900">{children}</p>
  )

  const Text = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <p className={`text-sm font-medium text-gray-500 ${className}`}>{children}</p>
  )

  const TrendIndicator = ({ value, positive }: { value: string; positive: boolean }) => (
    <span className={`inline-flex items-center ${positive ? "text-green-500" : "text-red-500"}`}>
      {positive ? (
        <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      ) : (
        <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      )}
      {value}
    </span>
  )

  const TimeFilterButton = ({ filter, label }: { filter: TimeFilter; label: string }) => (
    <button
      onClick={() => handleTimeFilterChange(filter)}
      className={`rounded-md px-3 py-1 text-sm font-medium ${
        timeFilter === filter ? "bg-blue-100 text-blue-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  )

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />

          <div className="container mx-auto px-16 py-8 max-sm:px-3">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard Overview</h1>

              <div className="flex items-center gap-2 rounded-lg bg-white p-2 shadow-sm">
                <span className="text-sm font-medium text-gray-500">Time Range:</span>
                <TimeFilterButton filter="day" label="Today" />
                <TimeFilterButton filter="week" label="This Week" />
                <TimeFilterButton filter="month" label="This Month" />
                <TimeFilterButton filter="all" label="All Time" />
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#e9f0ff] to-[#cfe2ff] p-6 shadow-sm transition-all hover:shadow-md">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

                <div className="relative z-10 mb-3 flex items-center justify-between">
                  <TotalAssets />
                  <select
                    value={selectedCurrencyId}
                    onChange={handleCurrencyChange}
                    className="rounded-md border border-gray-300 bg-white/80 px-2 py-1 text-xs backdrop-blur-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={currenciesLoading}
                  >
                    {currenciesLoading ? (
                      <option value={selectedCurrencyId}>Loading currencies...</option>
                    ) : (
                      currenciesData?.data.map((currency) => (
                        <option key={currency.id} value={currency.id}>
                          {currency.symbol}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="relative z-10 mb-2 flex items-center justify-between">
                  <Text>Customer Balance</Text>
                  <Text className="text-xs">
                    {timeFilter === "day"
                      ? "Today"
                      : timeFilter === "week"
                      ? "This Week"
                      : timeFilter === "month"
                      ? "This Month"
                      : "All Time"}
                  </Text>
                </div>
                {balanceLoading ? (
                  <div className="relative z-10 animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>
                    {selectedCurrencySymbol}
                    {customerBalance}
                  </Metric>
                )}
              </div>

              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <TransactionIcon />
                  <TrendIndicator
                    value={`${transactionMetrics.trendValue} (${timeFilter})`}
                    positive={transactionMetrics.trendPositive}
                  />
                </div>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Total Transactions</Text>
                  <Text className="text-xs">Avg. Transaction Size</Text>
                </div>
                {transactionOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Metric>{transactionMetrics.count.toLocaleString()} </Metric>
                    <Metric>NGN {transactionMetrics.avgTransactionSize.toFixed(2)}</Metric>
                  </div>
                )}
              </Card>

              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <CustomerIcon />
                  <TrendIndicator
                    value={`${userMetrics.trendValue} (${timeFilter})`}
                    positive={userMetrics.trendPositive}
                  />
                </div>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Total Users</Text>

                  <Text>Active Users</Text>
                </div>
                {overviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <Metric>{userMetrics.totalUsers?.toLocaleString() || "4,201"}</Metric>
                    <Metric>{userMetrics.newUsers.toLocaleString()}</Metric>
                  </div>
                )}
              </Card>
            </div>

            {/* Financial Metrics */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Deposits</Text>
                  <Text className="text-xs">
                    {timeFilter === "day"
                      ? "Today"
                      : timeFilter === "week"
                      ? "This Week"
                      : timeFilter === "month"
                      ? "This Month"
                      : "All Time"}
                  </Text>
                </div>
                {transactionOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>
                    NGN{" "}
                    {(timeFilter === "day"
                      ? transactionOverviewData?.data?.topUp_Today || 0
                      : timeFilter === "week"
                      ? transactionOverviewData?.data?.topUp_ThisWeek || 0
                      : timeFilter === "month"
                      ? transactionOverviewData?.data?.topUp_ThisMonth || 0
                      : transactionOverviewData?.data?.topUp_AllTime || 0
                    ).toLocaleString()}
                  </Metric>
                )}
              </Card>

              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Withdrawals</Text>
                  <Text className="text-xs">
                    {timeFilter === "day"
                      ? "Today"
                      : timeFilter === "week"
                      ? "This Week"
                      : timeFilter === "month"
                      ? "This Month"
                      : "All Time"}
                  </Text>
                </div>
                {transactionOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>
                    NGN{" "}
                    {(timeFilter === "day"
                      ? transactionOverviewData?.data?.withdraw_Today || 0
                      : timeFilter === "week"
                      ? transactionOverviewData?.data?.withdraw_ThisWeek || 0
                      : timeFilter === "month"
                      ? transactionOverviewData?.data?.withdraw_ThisMonth || 0
                      : transactionOverviewData?.data?.withdraw_AllTime || 0
                    ).toLocaleString()}
                  </Metric>
                )}
              </Card>

              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Buy Crypto</Text>
                  <Text className="text-xs">
                    {timeFilter === "day"
                      ? "Today"
                      : timeFilter === "week"
                      ? "This Week"
                      : timeFilter === "month"
                      ? "This Month"
                      : "All Time"}
                  </Text>
                </div>
                {transactionOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>
                    NGN{" "}
                    {(timeFilter === "day"
                      ? transactionOverviewData?.data?.buyCrypto_Today || 0
                      : timeFilter === "week"
                      ? transactionOverviewData?.data?.buyCrypto_ThisWeek || 0
                      : timeFilter === "month"
                      ? transactionOverviewData?.data?.buyCrypto_ThisMonth || 0
                      : transactionOverviewData?.data?.buyCrypto_AllTime || 0
                    ).toLocaleString()}
                  </Metric>
                )}
              </Card>

              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Sell Crypto</Text>
                  <Text className="text-xs">
                    {timeFilter === "day"
                      ? "Today"
                      : timeFilter === "week"
                      ? "This Week"
                      : timeFilter === "month"
                      ? "This Month"
                      : "All Time"}
                  </Text>
                </div>
                {transactionOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>
                    NGN{" "}
                    {(timeFilter === "day"
                      ? transactionOverviewData?.data?.sellCrypto_Today || 0
                      : timeFilter === "week"
                      ? transactionOverviewData?.data?.sellCrypto_ThisWeek || 0
                      : timeFilter === "month"
                      ? transactionOverviewData?.data?.sellCrypto_ThisMonth || 0
                      : transactionOverviewData?.data?.sellCrypto_AllTime || 0
                    ).toLocaleString()}
                  </Metric>
                )}
              </Card>
            </div>

            {/* Account Balances */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Total Crypto Balance</Text>
                </div>
                {cryptoOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>NGN{(cryptoOverviewData?.data?.total || 1059800).toLocaleString()}</Metric>
                )}
              </Card>

              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Master Account</Text>
                </div>
                {cryptoOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>NGN{(cryptoOverviewData?.data?.master || 125000).toLocaleString()}</Metric>
                )}
              </Card>

              <Card>
                <div className="mb-2 flex items-center justify-between border-b py-2">
                  <Text>Profit Account</Text>
                </div>
                {cryptoOverviewLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 w-32 rounded bg-gray-200"></div>
                  </div>
                ) : (
                  <Metric>NGN{(cryptoOverviewData?.data?.profit || 42500).toLocaleString()}</Metric>
                )}
              </Card>
            </div>

            {/* Transaction Volume Charts */}
            <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-1">
              <Card
                title={`Transaction Series - ${
                  timeFilter === "day"
                    ? "Today"
                    : timeFilter === "week"
                    ? "This Week"
                    : timeFilter === "month"
                    ? "This Month"
                    : "All Time"
                }`}
              >
                <div className="mt-4 h-96">
                  <ProfitChart timeFilter={timeFilter} />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
