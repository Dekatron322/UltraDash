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

interface PaymentAccount {
  id: number
  src: any
  name: string
  balance: string
}

export default function Dashboard() {
  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="flex flex-col">
            <div className="max-sm-my-4 flex w-full gap-6 px-16 max-md:flex-col  max-sm:px-3 max-sm:py-4 md:my-8"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
