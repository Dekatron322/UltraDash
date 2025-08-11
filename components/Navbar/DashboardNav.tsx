"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft"
import UserDropdown from "components/ui/UserDropdown/dropdown-popover"
import NotificationDropdown from "components/ui/UserDropdown/notification-popover"
import { RxCross2 } from "react-icons/rx"
import { Links } from "components/Sidebar/Links"
import UltraIcon from "public/ultra-icon"
import { useSelector } from "react-redux"
import { RootState } from "lib/redux/store"
import { ArrowDown, ArrowDown01Icon, ChevronDown } from "lucide-react"

const DashboardNav = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedTransactionType, setSelectedTransactionType] = useState("All Transactions")
  const pathname = usePathname()
  const user = useSelector((state: RootState) => state.auth.user)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

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

  // Dashboard menu items with permission checks
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      show: user?.admin?.permission?.canViewDashboard,
    },
    {
      name: "Customers",
      path: "/customers",
      show: user?.admin?.permission?.canViewUsers,
    },
    {
      name: "Transactions",
      path: "/transactions",
      show: user?.admin?.permission?.canViewTransactions,
      dropdown: true,
    },
    {
      name: "Crypto",
      path: "/crypto",
      show: user?.admin?.permission?.canViewTransactions,
    },
    {
      name: "Virtual Cards",
      path: "/virtual-accounts",
      show: user?.admin?.permission?.canViewTransactions,
    },
    {
      name: "Tickets & Events",
      path: "/tickets-and-events",
      show: true,
    },
    {
      name: "Role Management",
      path: "/role-management",
      show: user?.admin?.permission?.canManageSystemSettings,
    },
    {
      name: "Fees",
      path: "/fees",
      show: user?.admin?.permission?.canManageSystemSettings,
    },
  ]

  const transactionTypes = [
    { name: "Fiat Transactions", path: "/transactions" },
    { name: "Crypto Transactions", path: "/transactions/crypto" },
  ]

  return (
    <>
      <nav className="containerbg hidden border-b px-16 py-2 max-sm:px-3 md:block">
        <div className="flexBetween">
          <div className="flex items-center gap-10">
            <div className="flex border-r-2 pr-10">
              <UltraIcon />
            </div>
            {menuItems.map(
              (item) =>
                item.show && (
                  <div key={item.name} className="relative" ref={item.dropdown ? dropdownRef : null}>
                    {item.dropdown ? (
                      <div className="relative inline-block text-left">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className={`inline-flex items-center text-sm font-medium transition-all duration-300 ease-in-out ${
                            pathname.startsWith("/transactions")
                              ? "rounded-lg bg-[#e9f0ff] p-3 font-semibold text-[#003F9F]"
                              : "text-gray-600 hover:text-[#2F6FE3]"
                          }`}
                        >
                          {selectedTransactionType}
                          <ChevronDown className="ml-1 size-4" />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute left-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              {transactionTypes.map((type) => (
                                <Link
                                  key={type.name}
                                  href={type.path}
                                  onClick={() => {
                                    setSelectedTransactionType(type.name)
                                    setIsDropdownOpen(false)
                                  }}
                                  className={`block px-4 py-2 text-sm ${
                                    pathname === type.path
                                      ? "bg-[#e9f0ff] text-[#003F9F]"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {type.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.path}
                        className={`text-sm font-medium transition-all duration-300 ease-in-out ${
                          pathname === item.path
                            ? "rounded-lg bg-[#e9f0ff] p-3 font-semibold text-[#003F9F]"
                            : "text-gray-600 hover:text-[#2F6FE3]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
            )}
          </div>
          <div className="flex gap-4">
            <div className="flex content-center items-center justify-center gap-5">
              <NotificationDropdown />
            </div>
            <div className="flex content-center items-center justify-center gap-5">
              <UserDropdown />
            </div>
          </div>
        </div>
      </nav>

      <nav className="block border-b bg-[#E9F0FF] px-16 py-4 max-md:px-3 md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="content-center">
            <UltraIcon />
          </Link>
          <FormatAlignLeftIcon onClick={toggleNav} style={{ cursor: "pointer" }} />
        </div>

        <div
          className={`fixed left-0 top-0 z-50 h-full w-[250px] bg-[#ffffff] transition-transform duration-300 ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-end p-4">
            <RxCross2 className="text-white" onClick={toggleNav} style={{ cursor: "pointer" }} />
          </div>

          <div className="mt-4 flex flex-col items-start space-y-2 p-4">
            <Links isCollapsed={false} />

            <Link href="/logout" className="fixed bottom-2 mt-10 flex items-center gap-2 pb-4 text-white">
              <Image src="/Icons/Logout.svg" width={20} height={20} alt="logout" />
              <p className="mt-1">Logout</p>
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}

export default DashboardNav
