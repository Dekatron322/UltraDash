"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { FiRefreshCw } from "react-icons/fi"
import CustomerInfo from "components/CustomerInfo/CustomerInfo"
import DashboardNav from "components/Navbar/DashboardNav"
import { ButtonModule } from "components/ui/Button/Button"
import ActivateCustomerModal from "components/ui/Modal/activate-customer-modal"
import DeleteCustomerModal from "components/ui/Modal/delete-customer-modal"
import BackArrowIcon from "public/Icons/BackArrow"
import { useSelector } from "react-redux"
import { RootState } from "lib/redux/store"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { FormInputModule } from "components/ui/Input/Input"
import { useRefundWithdrawalMutation } from "lib/redux/cryptoSlice"

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

// Refund Withdrawal Modal Component
interface RefundWithdrawalModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onConfirm: (reference: string) => Promise<void>
  loading: boolean
  customerName: string
  successMessage?: string
  errorMessage?: string
}

const RefundWithdrawalModal: React.FC<RefundWithdrawalModalProps> = ({
  isOpen,
  onRequestClose,
  onConfirm,
  loading,
  customerName,
  successMessage,
  errorMessage,
}) => {
  const [reference, setReference] = useState("")

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReference(e.target.value)
  }

  const handleConfirm = async () => {
    await onConfirm(reference)
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[350px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Refund Withdrawal</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <p className="my-4">
          Process a refund for <strong>{customerName}</strong>
        </p>

        {successMessage && <div className="my-2 rounded-md bg-green-100 p-2 text-green-700">{successMessage}</div>}

        {errorMessage && <div className="my-2 rounded-md bg-red-100 p-2 text-red-700">{errorMessage}</div>}

        <FormInputModule
          label="Reference"
          type="text"
          placeholder="Enter transaction reference"
          value={reference}
          onChange={handleReferenceChange}
          className="mb-4"
        />

        <ButtonModule
          variant="primary"
          className="w-full"
          size="lg"
          onClick={handleConfirm}
          disabled={!reference.trim() || loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="mr-2 size-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Process Refund"
          )}
        </ButtonModule>
      </div>
    </Modal>
  )
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
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const [refundLoading, setRefundLoading] = useState(false)
  const [refundSuccess, setRefundSuccess] = useState("")
  const [refundError, setRefundError] = useState("")

  const [refundWithdrawal] = useRefundWithdrawalMutation()

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

  const handleRefundWithdrawal = async (reference: string) => {
    setRefundLoading(true)
    setRefundSuccess("")
    setRefundError("")

    try {
      // Store refund data in session storage for OTP verification
      const refundData = {
        reference,
        customerName: `${customer?.firstName} ${customer?.lastName}`,
        customerId: customer?.id,
        type: "refund",
      }

      sessionStorage.setItem("refundData", JSON.stringify(refundData))

      // Redirect to OTP verification page
      router.push("/crypto/verification-code/refund")
    } catch (error: any) {
      setRefundError(error.message || "Failed to initiate refund. Please try again.")
    } finally {
      setRefundLoading(false)
    }
  }

  return (
    <section className="h-full w-full">
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex w-full flex-col">
          <DashboardNav />

          {/* Header Bar */}
          <div className="container mx-auto flex justify-between border-b px-16 py-4 max-sm:flex-col max-sm:px-3">
            <div className="flex cursor-pointer items-center gap-2 whitespace-nowrap" onClick={() => router.back()}>
              <BackArrowIcon />
              <p className="font-medium md:text-lg">
                {customer?.firstName} {customer?.lastName}
              </p>
            </div>

            <div className="flex gap-4 max-sm:pt-4">
              <ButtonModule
                variant="primary"
                size="md"
                icon={<FiRefreshCw />}
                iconPosition="start"
                onClick={() => setIsRefundModalOpen(true)}
              >
                Refund Withdrawal
              </ButtonModule>
              {canManageUsers && (
                <ButtonModule variant="danger" size="md" iconPosition="end" onClick={() => setIsDeleteModalOpen(true)}>
                  Suspend
                </ButtonModule>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto mt-8 flex w-full gap-6 px-16 max-md:flex-col max-md:px-0 max-sm:my-4 max-sm:px-3">
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

      {/* Refund Withdrawal Modal */}
      <RefundWithdrawalModal
        isOpen={isRefundModalOpen}
        onRequestClose={() => {
          setIsRefundModalOpen(false)
          setRefundSuccess("")
          setRefundError("")
        }}
        onConfirm={handleRefundWithdrawal}
        loading={refundLoading}
        customerName={`${customer?.firstName} ${customer?.lastName}`}
        successMessage={refundSuccess}
        errorMessage={refundError}
      />
    </section>
  )
}

export default CustomerDetailPage
