"use client"
import React, { useEffect, useRef, useState } from "react"
import { RxCaretSort, RxDotsVertical } from "react-icons/rx"
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"
import { useRouter } from "next/navigation"
import ExportIcon from "public/export-icon"
import EmptyState from "public/empty-state"
import { ButtonModule } from "components/ui/Button/Button"
import { SearchModule } from "components/ui/Search/search-module"
import Filtericon from "public/filter-icon"
import { useGetUsersQuery } from "lib/redux/customerSlice"

interface Status {
  value: number
  label: string
}

interface Kyc {
  userId: number
  identityType: {
    value: number
    label: string
  }
  status: Status
  message: string | null
  documentFront: string | null
  approvalDate: string | null
  uploadedDate: string | null
  user: null
}

interface Customer {
  id: number
  firstName: string | null
  lastName: string | null
  phoneNumber: string
  tag: string | null
  photo: string | null
  email: string | null
  status: Status
  isVerified: boolean
  kyc: Kyc
  createdate?: string
  customerID?: string
  fullName?: string
  customerStatus?: boolean
}

type SortOrder = "asc" | "desc" | null

interface ActionDropdownProps {
  customer: Customer
  onViewDetails: (customer: Customer) => void
}

const ActionDropdown: React.FC<ActionDropdownProps> = ({ customer, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dropdownDirection, setDropdownDirection] = useState<"bottom" | "top">("bottom")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

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

  // Calculate dropdown position before opening
  const calculateDropdownPosition = () => {
    if (!dropdownRef.current) return

    const buttonRect = dropdownRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - buttonRect.bottom
    const spaceAbove = buttonRect.top
    const dropdownHeight = 120 // Approximate height of the dropdown

    // Open upwards if there's not enough space below but enough above
    if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
      setDropdownDirection("top")
    } else {
      setDropdownDirection("bottom")
    }
  }

  const handleButtonClick = () => {
    calculateDropdownPosition()
    setIsOpen(!isOpen)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.preventDefault()
    localStorage.setItem("selectedCustomer", JSON.stringify(customer))
    onViewDetails(customer)
    setIsOpen(false)
    router.push(`/customers/customer-detail/${customer.id}`)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="focus::bg-gray-100 flex size-7 cursor-pointer items-center justify-center gap-2 rounded-full transition-all duration-200 ease-in-out hover:bg-gray-200"
        onClick={handleButtonClick}
      >
        <RxDotsVertical />
      </div>
      {isOpen && (
        <div
          className="fixed z-50 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={
            dropdownDirection === "bottom"
              ? {
                  top: dropdownRef.current
                    ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY + 2
                    : 0,
                  right: dropdownRef.current
                    ? window.innerWidth - dropdownRef.current.getBoundingClientRect().right
                    : 0,
                }
              : {
                  bottom: dropdownRef.current
                    ? window.innerHeight - dropdownRef.current.getBoundingClientRect().top + window.scrollY + 2
                    : 0,
                  right: dropdownRef.current
                    ? window.innerWidth - dropdownRef.current.getBoundingClientRect().right
                    : 0,
                }
          }
        >
          <div className="py-1">
            <a
              href={`/customers/customer-detail/${customer.id}`}
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={handleViewDetails}
            >
              View Details
            </a>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Freeze customer:", customer.id)
                setIsOpen(false)
              }}
            >
              Freeze Account
            </button>
            <button
              className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => {
                console.log("Delete customer:", customer.id)
                setIsOpen(false)
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const LoadingSkeleton = () => {
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

const CustomersTable: React.FC = () => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)
  const [searchText, setSearchText] = useState("")
  const [searchType, setSearchType] = useState<"tag" | "email" | "phone">("tag")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const { data, isLoading, isError } = useGetUsersQuery({
    pageNumber: currentPage,
    pageSize,
    ...(searchText && searchType === "tag" && { tag: searchText }),
    ...(searchText && searchType === "email" && { email: searchText }),
    ...(searchText && searchType === "phone" && { phoneNumber: searchText }),
  })

  const customers = data?.data || []
  const totalRecords = data?.totalCount || 0
  const totalPages = data?.totalPages || 1

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const getStatusStyle = (status: Status) => {
    const isActive = status.value === 1
    return {
      backgroundColor: isActive ? "#EEF5F0" : "#F7EDED",
      color: isActive ? "#589E67" : "#AF4B4B",
    }
  }

  const toggleSort = (column: keyof Customer) => {
    const isAscending = sortColumn === column && sortOrder === "asc"
    setSortOrder(isAscending ? "desc" : "asc")
    setSortColumn(column)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value)
    setCurrentPage(1)
  }

  const handleCancelSearch = () => {
    setSearchText("")
    setCurrentPage(1)
  }

  const handleSearchTypeChange = (type: string) => {
    setSearchType(type as "tag" | "email" | "phone")
    setSearchText("")
    setCurrentPage(1)
  }

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <div>Error loading customers</div>

  return (
    <div className="relative">
      <div className="items-center justify-between border-b py-2 md:flex md:py-4">
        <p className="text-lg font-medium max-sm:pb-3 md:text-2xl">All Customers</p>
        <div className="flex gap-4">
          <SearchModule
            value={searchText}
            onChange={handleSearch}
            onCancel={handleCancelSearch}
            searchType={searchType}
            onSearchTypeChange={handleSearchTypeChange}
            placeholder={`Search by ${searchType}...`}
          />
          <ButtonModule
            variant="black"
            size="md"
            icon={<Filtericon />}
            iconPosition="end"
            onClick={() => alert("Filter clicked!")}
          >
            <p className="max-sm:hidden">Filter</p>
          </ButtonModule>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center gap-2 bg-[#F6F6F9]">
          <EmptyState />
          <p className="text-base font-bold text-[#202B3C]">
            {searchText ? "No matching customers found" : "No customers available"}
          </p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-x-auto border-l border-r bg-[#FFFFFF]">
            <table className="w-full min-w-[800px] border-separate border-spacing-0 text-left">
              <thead>
                <tr>
                  <th
                    className="flex cursor-pointer items-center gap-2 whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("id")}
                  >
                    <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                    Customers ID <RxCaretSort />
                  </th>
                  <th
                    className="text-500 cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("firstName")}
                  >
                    <div className="flex items-center gap-2">
                      Customer Name <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("email")}
                  >
                    <div className="flex items-center gap-2">
                      Email <RxCaretSort />
                    </div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("phoneNumber")}
                  >
                    <div className="flex items-center gap-2">
                      Phone <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">KYC Status</div>
                  </th>
                  <th
                    className="cursor-pointer whitespace-nowrap border-b p-4 text-sm"
                    onClick={() => toggleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      Status <RxCaretSort />
                    </div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Verification</div>
                  </th>
                  <th className="whitespace-nowrap border-b p-4 text-sm">
                    <div className="flex items-center gap-2">Action</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MdOutlineCheckBoxOutlineBlank className="text-lg" />
                        {customer.id}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-md bg-[#EDF0F4]">
                          {customer.firstName?.charAt(0)}
                          {customer.lastName?.charAt(0)}
                        </div>
                        <div className="flex flex-col gap-0">
                          <p className="m-0 inline-block leading-none text-[#202B3C]">
                            {customer.firstName || customer.lastName
                              ? `${customer.firstName || ""} ${customer.lastName || ""}`.trim()
                              : customer.tag || "N/A"}
                          </p>
                          <small className="text-grey-400 m-0 inline-block text-sm leading-none">
                            {customer.tag || "No tag"}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{customer.email || "N/A"}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">{customer.phoneNumber || "N/A"}</td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      {customer.kyc?.status?.label || "N/A"}
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      <div
                        style={getStatusStyle(customer.status)}
                        className="flex items-center justify-center gap-1 rounded-full px-2 py-1"
                      >
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: customer.status.value === 1 ? "#589E67" : "#AF4B4B" }}
                        ></span>
                        {customer.status.label}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-2 text-sm">
                      {customer.isVerified ? "Verified" : "Not Verified"}
                    </td>
                    <td className="whitespace-nowrap border-b px-4 py-1 text-sm">
                      <ActionDropdown customer={customer} onViewDetails={setSelectedCustomer} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t py-3">
            <div className="text-sm text-gray-700">
              Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data?.totalCount || 0)} of{" "}
              {data?.totalCount || 0} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`flex items-center justify-center rounded-md p-2 ${
                  currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-[#003F9F] hover:bg-gray-100"
                }`}
              >
                <MdOutlineArrowBackIosNew />
              </button>

              {Array.from({ length: Math.min(5, data?.totalPages || 1) }).map((_, index) => {
                // Calculate page number based on current position
                let pageNum
                if (data?.totalPages && data.totalPages <= 5) {
                  pageNum = index + 1
                } else if (currentPage <= 3) {
                  pageNum = index + 1
                } else if (currentPage >= (data?.totalPages || 0) - 2) {
                  pageNum = (data?.totalPages || 0) - 4 + index
                } else {
                  pageNum = currentPage - 2 + index
                }

                return (
                  <button
                    key={index}
                    onClick={() => paginate(pageNum)}
                    className={`flex size-8 items-center justify-center rounded-md text-sm ${
                      currentPage === pageNum
                        ? "bg-[#003F9F] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}

              {data?.totalPages && data.totalPages > 5 && currentPage < data.totalPages - 2 && (
                <span className="px-2">...</span>
              )}

              {data?.totalPages && data.totalPages > 5 && currentPage < data.totalPages - 1 && (
                <button
                  onClick={() => paginate(data.totalPages)}
                  className={`flex size-8 items-center justify-center rounded-md text-sm ${
                    currentPage === data.totalPages
                      ? "bg-[#003F9F] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {data.totalPages}
                </button>
              )}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === data?.totalPages}
                className={`flex items-center justify-center rounded-md p-2 ${
                  currentPage === data?.totalPages
                    ? "cursor-not-allowed text-gray-400"
                    : "text-[#003F9F] hover:bg-gray-100"
                }`}
              >
                <MdOutlineArrowForwardIos />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CustomersTable
