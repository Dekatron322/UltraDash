"use client"

import React, { useState } from "react"
import Modal from "react-modal"
import { MdClose } from "react-icons/md"
import { ButtonModule } from "components/ui/Button/Button"

interface NotificationModalProps {
  isOpen: boolean
  customer: {
    email: string
    fullName: string
  }
  onRequestClose: () => void
  onSendNotification: (message: string) => void
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  customer,
  onRequestClose,
  onSendNotification,
}) => {
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSend = async () => {
    setIsSending(true)
    try {
      await onSendNotification(message)
      setIsSent(true)
      setTimeout(() => {
        onRequestClose()
        setIsSent(false)
        setMessage("")
      }, 1500)
    } catch (error) {
      console.error("Failed to send notification:", error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="flex h-auto w-[500px] overflow-hidden rounded-md bg-white shadow-lg outline-none max-sm:w-full max-sm:max-w-[380px]"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      ariaHideApp={false}
    >
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#E9F0FF] p-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-[#003F9F] font-semibold text-white">
              N
            </div>
            <p className="text-xl font-semibold text-[#2a2f4b]">Send Notification</p>
          </div>
          <button onClick={onRequestClose} className="cursor-pointer text-gray-600 hover:text-gray-800">
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSent ? (
            <div className="py-8 text-center">
              <div className="mb-4 text-5xl text-green-500">✓</div>
              <h3 className="mb-1 text-lg font-semibold">Notification Sent!</h3>
              <p className="text-gray-600">Your message has been delivered to {customer.fullName}</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="mb-2 text-sm text-gray-600">
                  Recipient: {customer.fullName} ({customer.email})
                </p>
                <textarea
                  className="h-40 w-full rounded-md border border-gray-300 bg-white p-3 focus:outline-none focus:ring-2 focus:ring-[#003F9F]"
                  placeholder="Type your notification message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3">
                <ButtonModule
                  variant="outline"
                  size="md"
                  onClick={onRequestClose}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </ButtonModule>
                <ButtonModule variant="primary" size="md" onClick={handleSend} disabled={!message.trim() || isSending}>
                  {isSending ? "Sending..." : "Send Notification"}
                </ButtonModule>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default NotificationModal
