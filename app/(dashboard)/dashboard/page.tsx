"use client"

import DashboardNav from "components/Navbar/DashboardNav"
import TotalAssets from "public/total-assets"
import TransactionIcon from "public/transaction-icon"
import AccountIcon from "public/accounts-icon"
import WarningIcon from "public/warning-icon"
import CustomerIcon from "public/customer-icon"
import { ButtonModule } from "components/ui/Button/Button"
import InsightIcon from "public/insight-icon"
import ExchangeRateMarquee from "components/ui/ExchangeRate/exchange-rate"
import { TransactionChart } from "components/Dashboard/TransactionChart"
import { ProfitChart } from "components/Dashboard/ProfitChart"
import { UserGrowthChart } from "components/Dashboard/UserGrowthChart"
import { AssetDistributionChart } from "components/Dashboard/AssetDistributionChart"
import { AccountDistributionChart } from "components/Dashboard/AccountDistributionChart"
import { useGetCurrenciesQuery, useGetCustomerBalanceQuery } from "lib/redux/overviewSlice"
import { useEffect, useState } from "react"

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

// Update the interface to match the actual API response
export interface CustomerBalanceResponse {
  data: {
    totalBalance: number
  }
  isSuccess: boolean
  message: string
}

export default function Dashboard() {
  const [selectedCurrencyId, setSelectedCurrencyId] = useState<number>(1) // Default to NGN (ID: 1)
  const [customerBalance, setCustomerBalance] = useState<string>("0")
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState<string>("NGN")

  // Fetch currencies
  const { data: currenciesData, isLoading: currenciesLoading } = useGetCurrenciesQuery()

  // Fetch customer balance based on selected currency
  const { data: balanceData, isLoading: balanceLoading, refetch } = useGetCustomerBalanceQuery(
    { currencyId: selectedCurrencyId },
    { skip: !selectedCurrencyId }
  )

  useEffect(() => {
    if (balanceData?.data) {
      try {
        // Try array structure first
        if (Array.isArray(balanceData.data)) {
          const totalBalance = balanceData.data.reduce((sum: number, currency: any) => sum + (currency.balance || 0), 0);
          setCustomerBalance(totalBalance.toLocaleString());
        } 
        // If it's a single object with totalBalance property (based on your original code)
        else if (typeof balanceData.data === 'object' && 'totalBalance' in balanceData.data) {
          setCustomerBalance((balanceData.data as any).totalBalance.toLocaleString());
        }
        // Default fallback
        else {
          setCustomerBalance("0");
        }
      } catch (error) {
        console.error('Error processing balance data:', error);
        setCustomerBalance("0");
      }
    } else {
      setCustomerBalance("0");
    }
  }, [balanceData]);

  useEffect(() => {
    // Update currency symbol when currency changes
    if (currenciesData?.data) {
      const selectedCurrency = currenciesData.data.find(currency => currency.id === selectedCurrencyId)
      if (selectedCurrency) {
        setSelectedCurrencySymbol(selectedCurrency.symbol)
      }
    }
  }, [selectedCurrencyId, currenciesData])

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrencyId = Number(event.target.value)
    setSelectedCurrencyId(newCurrencyId)
  }

  // Sample data for charts
  const transactionData = [
    { month: "Jan", crypto: 1200, fiat: 1800 },
    { month: "Feb", crypto: 1900, fiat: 2100 },
    { month: "Mar", crypto: 1500, fiat: 1700 },
    { month: "Apr", crypto: 2200, fiat: 2500 },
    { month: "May", crypto: 2800, fiat: 2300 },
    { month: "Jun", crypto: 3100, fiat: 2900 },
  ]

  const profitData = [
    { month: "Jan", profit: 450 },
    { month: "Feb", profit: 620 },
    { month: "Mar", profit: 500 },
    { month: "Apr", profit: 780 },
    { month: "May", profit: 920 },
    { month: "Jun", profit: 1050 },
  ]

  const userGrowthData = [
    { month: "Jan", users: 1200 },
    { month: "Feb", users: 1850 },
    { month: "Mar", users: 2200 },
    { month: "Apr", users: 2800 },
    { month: "May", users: 3500 },
    { month: "Jun", users: 4200 },
  ]

  const assetDistribution = [
    { name: "BTC", value: 35 },
    { name: "ETH", value: 25 },
    { name: "USDT", value: 15 },
    { name: "Other Crypto", value: 10 },
    { name: "USD", value: 10 },
    { name: "EUR", value: 5 },
  ]

  const accountTypes = [
    { name: "Master", value: 60 },
    { name: "Profit", value: 30 },
    { name: "User", value: 10 },
  ]

  const paymentAccounts = [
    { id: 1, src: AccountIcon, name: "Master Account", balance: "$125,000" },
    { id: 2, src: AccountIcon, name: "Profit Account", balance: "$42,500" },
    { id: 3, src: AccountIcon, name: "User Funds", balance: "$892,300" },
  ]

  // Custom card component with improved styling
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
    <p className="text-3xl font-bold text-gray-900">{children}</p>
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

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />

          <div className="container mx-auto px-16  py-8 max-sm:px-3">
            {/* Header */}
            <div className="mb-3">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">Dashboard Overview</h1>
            </div>

            {/* Exchange Rates Marquee - Would go here */}

            {/* Top Metrics Cards */}
            <div className="mb-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Assets Card with Enhanced Gradient */}
              <div className="rounded-xl bg-gradient-to-br from-[#e9f0ff] to-[#cfe2ff] p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                
                <div className="mb-3 flex items-center justify-between relative z-10">
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
                <div className="mb-2 flex items-center justify-between relative z-10">
                  <Text>Customer Balance</Text>
                </div>
                {balanceLoading ? (
                  <div className="animate-pulse relative z-10">
                    <div className="h-8 w-32 bg-gray-200 rounded"></div>
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
                  <TrendIndicator value="8.3% (30d)" positive={true} />
                </div>
                <Text>Transactions (30d)</Text>
                <Metric>24,568</Metric>
              </Card>

              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <CustomerIcon />
                  <TrendIndicator value="15.2% (30d)" positive={true} />
                </div>
                <Text>Active Users</Text>
                <Metric>4,201</Metric>
              </Card>

              <Card>
                <div className="mb-3 flex items-center justify-between">
                  <WarningIcon />
                  <TrendIndicator value="2 (7d)" positive={false} />
                </div>
                <Text>Pending Issues</Text>
                <Metric>12</Metric>
              </Card>
            </div>

            {/* Secondary Metrics */}
            <div className="mb-3 grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <Text>Avg. Transaction Size</Text>
                <Metric>$245.60</Metric>
                <TrendIndicator value="5.2% (30d)" positive={true} />
              </Card>

              <Card>
                <Text>Crypto/Fiat Ratio</Text>
                <Metric>52%/48%</Metric>
                <TrendIndicator value="Crypto ↑ 7% (30d)" positive={true} />
              </Card>

              <Card>
                <Text>New Users (30d)</Text>
                <Metric>892</Metric>
                <TrendIndicator value="18.3% (30d)" positive={true} />
              </Card>
            </div>

            {/* Transaction Volume Charts */}
            <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="Transaction Volume (Crypto vs Fiat)">
                <p className="text-gray-500">Welcome back! Here&apos;s what&apos;s happening with your platform.</p>
                <div className="mt-4 h-80">
                  <TransactionChart data={transactionData} />
                </div>
                <div className="mt-4 flex justify-end">
                  <ButtonModule size="sm" variant="ghost" className="flex items-center gap-2">
                    <InsightIcon />
                    Insights
                  </ButtonModule>
                </div>
              </Card>

              <Card title="Profit Analysis">
                <div className="mt-4 h-80">
                  <ProfitChart data={profitData} />
                </div>
                <div className="mt-4 flex justify-end">
                  <ButtonModule size="sm" variant="ghost" className="flex items-center gap-2">
                    <InsightIcon />
                    Insights
                  </ButtonModule>
                </div>
              </Card>
            </div>

            {/* User Growth and Asset Distribution */}
            <div className="mb-3 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="User Growth">
                <div className="mt-4 h-80">
                  <UserGrowthChart data={userGrowthData} />
                </div>
                <div className="mt-4 flex justify-end">
                  <ButtonModule size="sm" variant="ghost" className="flex items-center gap-2">
                    <InsightIcon />
                    Insights
                  </ButtonModule>
                </div>
              </Card>

              <Card title="Asset Distribution">
                <div className="mt-4 h-80">
                  <AssetDistributionChart data={assetDistribution} />
                </div>
                <div className="mt-4 flex justify-end">
                  <ButtonModule size="sm" variant="ghost" className="flex items-center gap-2">
                    <InsightIcon />
                    Insights
                  </ButtonModule>
                </div>
              </Card>
            </div>

            {/* Account Analysis */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card title="Account Type Distribution">
                <div className="mt-4 h-80">
                  <AccountDistributionChart data={accountTypes} />
                </div>
                <div className="mt-4 flex justify-end">
                  <ButtonModule size="sm" variant="ghost" className="flex items-center gap-2">
                    <InsightIcon />
                    Insights
                  </ButtonModule>
                </div>
              </Card>

              <Card title="Account Balances">
                <div className="space-y-4">
                  {paymentAccounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <account.src className="h-6 w-6 text-gray-400" />
                        <Text>{account.name}</Text>
                      </div>
                      <Metric>{account.balance}</Metric>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-end">
                  <ButtonModule size="sm" variant="ghost" className="flex items-center gap-2">
                    <InsightIcon />
                    Insights
                  </ButtonModule>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}