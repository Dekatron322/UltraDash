"use client"
import DashboardNav from "components/Navbar/DashboardNav"

import InsightIcon from "public/insight-icon"
import IncomingIcon from "public/incoming-icon"
import OutgoingIcon from "public/outgoing-icon"
import UnresolvedTransactions from "public/unresolved-transactions"
import ArrowIcon from "public/arrow-icon"
import AllAccountsTable from "components/Tables/AllAccountsTable"
import { useState } from "react"
import AddCustomerModal from "components/ui/Modal/add-customer-modal"

export default function AllTransactions() {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)

  // Mock data instead of API calls
  const totalCustomers = 0
  const activeCustomers = 0
  const frozenCustomers = 0
  const inactiveCustomers = 0

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const handleAddCustomerSuccess = async () => {
    setIsAddCustomerModalOpen(false)
  }

  return (
    <section className="h-full w-full ">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="container mx-auto flex flex-col">
            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
                  <div className="flex w-full max-sm:flex-col">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col ">
                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <InsightIcon />
                            Overview
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Accounts count:</p>
                              <p className="text-secondary font-medium">{formatNumber(totalCustomers)}</p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Active Accounts:</p>
                              <p className="text-secondary font-medium">{formatNumber(activeCustomers)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <IncomingIcon />
                            Active Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <p className="text-secondary font-medium">{formatNumber(activeCustomers)}</p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Percentage:</p>
                              <p className="text-secondary font-medium">
                                {totalCustomers > 0 ? `${Math.round((activeCustomers / totalCustomers) * 100)}%` : "0%"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <OutgoingIcon />
                            Frozen Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <p className="text-secondary font-medium">{formatNumber(frozenCustomers)}</p>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Percentage:</p>
                              <p className="text-secondary font-medium">
                                {totalCustomers > 0 ? `${Math.round((frozenCustomers / totalCustomers) * 100)}%` : "0%"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="small-card rounded-md p-2 transition duration-500 md:border">
                          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
                            <UnresolvedTransactions />
                            Inactive Accounts
                          </div>
                          <div className="flex flex-col items-end justify-between gap-3 pt-4">
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Total:</p>
                              <div className="flex gap-1">
                                <p className="text-secondary font-medium">{formatNumber(inactiveCustomers)}</p>
                                <ArrowIcon />
                              </div>
                            </div>
                            <div className="flex w-full justify-between">
                              <p className="text-grey-200">Pending Approval:</p>
                              <p className="text-secondary font-medium">{inactiveCustomers}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <AllAccountsTable />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddCustomerModal
        isOpen={isAddCustomerModalOpen}
        onRequestClose={() => setIsAddCustomerModalOpen(false)}
        onSuccess={handleAddCustomerSuccess}
      />
    </section>
  )
}
