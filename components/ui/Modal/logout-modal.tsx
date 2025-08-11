"use client"

import React from "react"
import Modal from "react-modal"
import CloseIcon from "public/close-icon"
import { ButtonModule } from "../Button/Button"
import { useDispatch } from "react-redux"
import { logout } from "lib/redux/authSlice"
import { useRouter } from "next/navigation"
import { AppDispatch } from "lib/redux/store"

// Define the props for the modal
interface LogoutModalProps {
  isOpen: boolean
  onRequestClose: () => void
  onConfirm?: () => void // Made optional since we're handling it internally
  loading: boolean
}

const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onRequestClose, onConfirm, loading }) => {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // Dispatch the logout action
      dispatch(logout())

      // Call any additional onConfirm logic if provided
      if (onConfirm) {
        onConfirm()
      }

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="mt-20 w-[350px] max-w-md overflow-hidden rounded-md bg-white shadow-lg outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 overflow-hidden flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-between bg-[#F5F8FA] p-4">
        <h2 className="text-lg font-bold">Confirm Logout</h2>
        <div onClick={onRequestClose} className="cursor-pointer">
          <CloseIcon />
        </div>
      </div>
      <div className="px-4 pb-6">
        <p className="my-4">Are you sure you want to log out?</p>
        <div className="flex justify-end gap-4">
          <ButtonModule variant="secondary" size="lg" className="w-full" onClick={onRequestClose}>
            Cancel
          </ButtonModule>
          <ButtonModule
            type="button"
            variant="danger"
            size="lg"
            className="w-full"
            onClick={handleLogout}
            disabled={loading}
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
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging out...
              </div>
            ) : (
              "Log Out"
            )}
          </ButtonModule>
        </div>
      </div>
    </Modal>
  )
}

export default LogoutModal
