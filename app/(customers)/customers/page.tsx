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
import { useGetOverviewQuery } from "lib/redux/overviewSlice"
import { motion } from "framer-motion"

// Skeleton Loader Component
const SkeletonLoader = () => {
  return (
    <div className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1">
      {[...Array(4)].map((_, index) => (
        <motion.div
          key={index}
          className="small-card rounded-md bg-white p-2 transition duration-500 md:border"
          initial={{ opacity: 0.6 }}
          animate={{
            opacity: [0.6, 1, 0.6],
            transition: {
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <div className="flex items-center gap-2 border-b pb-4 max-sm:mb-2">
            <div className="h-5 w-5 rounded-full bg-gray-200"></div>
            <div className="h-4 w-24 rounded bg-gray-200"></div>
          </div>
          <div className="flex flex-col items-end justify-between gap-3 pt-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex w-full justify-between">
                <div className="h-4 w-24 rounded bg-gray-200"></div>
                <div className="h-4 w-10 rounded bg-gray-200"></div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Skeleton for the table
const TableSkeleton = () => {
  return (
    <div className="flex-3 mt-5 flex flex-col rounded-md border bg-white p-5">
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200"></div>
        <div className="mt-3 flex gap-4 md:mt-0">
          <div className="h-10 w-48 animate-pulse rounded bg-gray-200"></div>
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>

      <div className="w-full overflow-x-auto border-l border-r bg-[#f9f9f9]">
        <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
          <thead>
            <tr>
              {[...Array(8)].map((_, i) => (
                <th key={i} className="whitespace-nowrap border-b p-4">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, rowIndex) => (
              <tr key={rowIndex}>
                {[...Array(8)].map((_, cellIndex) => (
                  <td key={cellIndex} className="whitespace-nowrap border-b px-4 py-3">
                    <div className="h-4 w-full animate-pulse rounded bg-gray-200"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t py-3">
        <div className="h-4 w-48 animate-pulse rounded bg-gray-200"></div>
        <div className="flex items-center gap-2">
          <div className="size-8 animate-pulse rounded bg-gray-200"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="size-8 animate-pulse rounded bg-gray-200"></div>
          ))}
          <div className="size-8 animate-pulse rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  )
}

export default function AllTransactions() {
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState(false)

  // Use the overview API hook
  const { data: overviewData, error, isLoading } = useGetOverviewQuery()

  // Use actual data from API instead of mock data
  const totalCustomers = overviewData?.data?.totalUsers || 0
  const activeCustomers = overviewData?.data?.verifiedUsers || 0
  const frozenCustomers = overviewData?.data?.banned_Suspended_Users || 0
  const inactiveCustomers = overviewData?.data?.unverifiedUsers || 0

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const handleAddCustomerSuccess = async () => {
    setIsAddCustomerModalOpen(false)
  }

  if (isLoading) {
    return (
      <section className="h-full w-full ">
        <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex w-full flex-col">
            <DashboardNav />
            <div className="container mx-auto flex flex-col">
              <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
                <div className="w-full">
                  <SkeletonLoader />
                  <TableSkeleton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="h-full w-full ">
        <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex w-full flex-col">
            <DashboardNav />
            <div className="container mx-auto flex flex-col">
              <motion.div
                className="flex w-full items-center justify-center px-16 max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-lg text-red-500">Error loading overview data</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="h-full w-full ">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />
          <div className="container mx-auto flex flex-col">
            <div className="flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3 md:my-8">
              <div className="w-full">
                <motion.div
                  className="flex w-full gap-3 max-lg:grid max-lg:grid-cols-2 max-sm:grid-cols-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex w-full max-sm:flex-col">
                    <div className="w-full">
                      <div className="mb-3 flex w-full cursor-pointer gap-3 max-sm:flex-col ">
                        <motion.div
                          className="small-card rounded-md p-2 transition duration-500 md:border"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        >
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
                        </motion.div>

                        <motion.div
                          className="small-card rounded-md p-2 transition duration-500 md:border"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        >
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
                        </motion.div>

                        <motion.div
                          className="small-card rounded-md p-2 transition duration-500 md:border"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        >
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
                        </motion.div>

                        <motion.div
                          className="small-card rounded-md p-2 transition duration-500 md:border"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        >
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
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <AllAccountsTable />
                </motion.div>
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
