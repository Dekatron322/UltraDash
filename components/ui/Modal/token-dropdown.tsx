"use client"
import React, { useState, useRef, useEffect } from "react"
import { FiChevronDown, FiCheck } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

interface Token {
  symbol: string
  icon: React.ReactNode
  name: string
  color: string
}

interface TokenDropdownProps {
  selectedToken: Token
  onSelect: (token: Token) => void
  tokens: Token[]
}

const TokenDropdown: React.FC<TokenDropdownProps> = ({ selectedToken, onSelect, tokens }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative  " ref={dropdownRef}>
      <motion.button
        type="button"
        className="  z-10 flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 transition-colors hover:bg-gray-200"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className={`h-6 w-6 rounded-full ${selectedToken.color} flex items-center justify-center text-white`}>
          {selectedToken.icon}
        </div>
        <span className="font-medium">{selectedToken.symbol}</span>
        <FiChevronDown className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50  mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
          >
            <div className="py-1">
              {tokens.map((token) => (
                <button
                  key={token.symbol}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 ${
                    selectedToken.symbol === token.symbol ? "bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    onSelect(token)
                    setIsOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full ${token.color} flex items-center justify-center text-white`}>
                      {token.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{token.symbol}</p>
                      <p className="text-xs text-gray-500">{token.name}</p>
                    </div>
                  </div>
                  {selectedToken.symbol === token.symbol && <FiCheck className="text-blue-500" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TokenDropdown
