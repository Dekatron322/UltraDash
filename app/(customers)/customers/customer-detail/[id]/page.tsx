"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import CustomerInfo from "components/CustomerInfo/CustomerInfo"
import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import ActivateCustomerModal from "components/ui/Modal/activate-customer-modal"
import DeleteCustomerModal from "components/ui/Modal/delete-customer-modal"
import BackArrowIcon from "public/Icons/BackArrow"
import { useSelector } from "react-redux"
import { RootState } from "lib/redux/store"

interface Account {
  id: string
  accountNumber: string
}

interface Business {
  id: string
  name: string
}

interface CustomerType {
  customerID: string
  id: string
  firstName: string
  lastName: string
  customerStatus: boolean
}

const CustomerDetailPage: React.FC = () => {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const rawId = params?.id ?? ""
  const user = useSelector((state: RootState) => state.auth.user)
  const canManageUsers = user?.admin?.permission?.canManageUsers

  // Local customer data
  const [customer, setCustomer] = useState<CustomerType | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [business, setBusiness] = useState<Business | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    try {
      const raw = localStorage.getItem("selectedCustomer")
      if (raw) {
        const parsed = JSON.parse(raw) as CustomerType
        setCustomer(parsed)

        // Mock accounts data
        setAccounts([
          {
            id: "acc1",
            accountNumber: "1234567890",
          },
          {
            id: "acc2",
            accountNumber: "0987654321",
          },
        ])

        // Mock business data if customer is a business
        if (parsed.customerID.startsWith("BUS")) {
          setBusiness({
            id: "bus1",
            name: `${parsed.firstName}'s Business`,
          })
        }
      } else {
        // Fallback mock data if nothing in localStorage
        const mockCustomer: CustomerType = {
          customerID: rawId || "CUST001",
          id: "cust-001",
          firstName: "John",
          lastName: "Doe",
          customerStatus: true,
        }
        setCustomer(mockCustomer)
        setAccounts([
          {
            id: "acc1",
            accountNumber: "1234567890",
          },
        ])
      }
    } catch (e) {
      console.warn("Could not parse customer data:", e)
    }
  }, [rawId])

  // Modal state
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false)
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const handleActivateSuccess = () => {
    if (customer) {
      setCustomer({ ...customer, customerStatus: true })
    }
    setIsActivateModalOpen(false)
  }

  const handleDeactivateSuccess = () => {
    if (customer) {
      setCustomer({ ...customer, customerStatus: false })
    }
    setIsDeactivateModalOpen(false)
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />

          {/* Header Bar */}
          <div className="flex justify-between border-b px-16 py-4 max-sm:flex-col max-sm:px-3">
            <div className="flex cursor-pointer items-center gap-2 whitespace-nowrap" onClick={() => router.back()}>
              <BackArrowIcon />
              <p className="font-medium md:text-lg">
                {customer?.firstName} {customer?.lastName}
              </p>
            </div>

            {canManageUsers && (
              <div className="flex gap-4 max-sm:pt-4">
                <ButtonModule
                  variant="outlineDanger"
                  size="md"
                  iconPosition="end"
                  onClick={() => setIsActivateModalOpen(true)}
                >
                  Ban User
                </ButtonModule>

                <ButtonModule variant="danger" size="md" iconPosition="end" onClick={() => setIsDeleteModalOpen(true)}>
                  Suspend
                </ButtonModule>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="mt-8 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3">
            <div className="w-full">
              <CustomerInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Activate Customer Modal */}
      <ActivateCustomerModal
        isOpen={isActivateModalOpen}
        onRequestClose={() => setIsActivateModalOpen(false)}
        onSuccess={handleActivateSuccess}
        customerName={`John Doe`}
        customerId={0}
      />

      {/* Delete Customer Modal */}
      <DeleteCustomerModal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        customerName={`John Doe`}
        customerId={0}
      />
    </section>
  )
}

export default CustomerDetailPage
