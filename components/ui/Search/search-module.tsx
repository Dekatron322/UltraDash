"use client"
import React, { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { RxCross2, RxCaretDown } from "react-icons/rx"

interface SearchModuleProps {
  /** The current search text */
  value: string
  /** Handler for when the search text changes */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Optional callback when the cancel (clear) icon is clicked */
  onCancel?: () => void
  /** Placeholder text for the input */
  placeholder?: string
  /** Additional Tailwind or custom classes to apply */
  className?: string
  /** Current search type */
  searchType?: string
  /** Handler for search type change */
  onSearchTypeChange?: (type: string) => void
  /** Available search type options */
  searchTypeOptions?: {
    value: string
    label: string
  }[]
}

export const SearchModule: React.FC<SearchModuleProps> = ({
  value,
  onChange,
  onCancel,
  placeholder = "Search",
  className = "",
  searchType = "tag",
  onSearchTypeChange,
  searchTypeOptions = [
    { value: "tag", label: "Tag" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
  ],
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get the current label for the selected search type
  const currentLabel = searchTypeOptions.find(opt => opt.value === searchType)?.label || "Tag"

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionClick = (value: string) => {
    if (onSearchTypeChange) {
      onSearchTypeChange(value)
    }
    setIsDropdownOpen(false)
  }

  return (
    <div
      className={`flex h-[37px] w-[380px] items-center justify-between gap-3 rounded-md border bg-white px-0 text-[#707070] transition-all duration-200 focus-within:ring-2 focus-within:ring-[#003F9F] focus-within:ring-offset-2 hover:border-[#003F9F] ${className}`}
    >
      {/* Search type dropdown */}
      {onSearchTypeChange && (
        <div className="relative h-full" ref={dropdownRef}>
          <button
            type="button"
            className="flex h-full items-center justify-between rounded-l-md border-r bg-gray-50 px-3 text-sm outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span>{currentLabel}</span>
            <RxCaretDown className={`ml-2 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          
          {/* Dropdown popover */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
              {searchTypeOptions.map((option) => (
                <div
                  key={option.value}
                  className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 ${
                    searchType === option.value ? "bg-gray-100 font-medium" : ""
                  }`}
                  onClick={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Search input */}
      <div className="flex flex-1 items-center gap-2 px-3">
        <Image src="/DashboardImages/Search.svg" width={16} height={16} alt="Search Icon" />
        <input
          type="text"
          id="search"
          placeholder={placeholder}
          className="h-[50px] w-full bg-transparent outline-none"
          value={value}
          onChange={onChange}
        />
        {value && onCancel && <RxCross2 onClick={onCancel} style={{ cursor: "pointer" }} />}
      </div>
    </div>
  )
}