"use client"

import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { BusinessLogo, DashboardIcon, EmployeeLogo, NoteIcon, Pricing, ServiceIcon } from "./Icons"
import SettingIcon from "public/setting-icon"

const links = [
  { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
  {
    name: "Customers",
    href: "/customers",
    icon: ServiceIcon,
  },
  {
    name: "All Transactions",
    href: "",
    icon: SettingIcon,
    sublinks: [
      { name: "Fiat Transactions", href: "/transactions" },
      { name: "Crypto Transactions", href: "/transactions/crypto" },
    ],
  },
  { name: "Crypto", href: "/crypto", icon: BusinessLogo },
  { name: "Virtual Cards", href: "/virtual-accounts", icon: NoteIcon },

  { name: "Tickets & Events", href: "/tickets-and-events", icon: BusinessLogo },
  { name: "Role Management", href: "/role-management", icon: BusinessLogo },
  { name: "Fees", href: "/fees", icon: BusinessLogo },
]

interface LinksProps {
  isCollapsed: boolean
}

export function Links({ isCollapsed }: LinksProps) {
  const pathname = usePathname()
  const [expandedLink, setExpandedLink] = useState<string | null>(null)

  const handleExpand = (linkName: string) => {
    setExpandedLink(expandedLink === linkName ? null : linkName)
  }

  return (
    <div className="flex flex-col border-black">
      {links.map((link) => {
        const LinkIcon = link.icon
        const isActive = link.href ? pathname.startsWith(link.href) : false
        const hasActiveSublink = link.sublinks?.some((sublink) => pathname.startsWith(sublink.href)) || false
        const isExpanded = expandedLink === link.name
        const isLinkActive = link.href ? isActive : hasActiveSublink

        return (
          <div key={link.name}>
            <div
              onClick={() => link.sublinks && handleExpand(link.name)}
              className={clsx("dashboard-style", {
                "active-dashboard": isLinkActive,
              })}
            >
              <Link href={link.href || "#"}>
                <div className="flex w-full items-center justify-between gap-2 pl-5">
                  <LinkIcon isActive={isLinkActive} />
                  <p
                    className={clsx("text-sm font-medium transition-opacity duration-500", {
                      hidden: isCollapsed,
                      "font-extrabold transition-opacity duration-500": isLinkActive,
                    })}
                  >
                    {link.name}
                  </p>
                  {link.sublinks && (
                    <img
                      src="/Icons/CaretDown.png"
                      className={clsx("mr-20 transition-transform duration-300", {
                        "rotate-180 transform": isExpanded,
                      })}
                      alt="Caret Icon"
                    />
                  )}
                </div>
              </Link>
            </div>
            {isExpanded && !isCollapsed && link.sublinks && (
              <div className="relative ml-9 border-l-2 border-gray-300">
                {link.sublinks.map((sublink) => {
                  const isSublinkActive = pathname.startsWith(sublink.href)
                  return (
                    <Link
                      key={sublink.name}
                      href={sublink.href}
                      className={clsx("dashboard-style block", {
                        "active-dashboard": isSublinkActive,
                      })}
                    >
                      <div className="flex items-center gap-2 pl-5">
                        <p
                          className={clsx("text-sm font-semibold", {
                            "font-extrabold": isSublinkActive,
                          })}
                        >
                          {sublink.name}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
