"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  LibraryBig,
  BookOpen,
  Settings,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import Logo from "@/icons/Logo";
import LogoText from "@/icons/LogoText";
import Image from "next/image";

const Sidebar = ({ className = "" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Catalog", href: "/dashboard/catalog", icon: LibraryBig },
    { name: "My Loans", href: "/dashboard/loans", icon: BookOpen },
    { name: "My WishList", href: "/dashboard/wishlist", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];

  const isActive = (path) => {
    return router.pathname === path;
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-50 md:hidden flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="sr-only">Open sidebar</span>
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col 
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} 
          ${collapsed ? "w-20" : "w-64"} 
          transform transition-all duration-300 ease-in-out
          bg-[#222] text-white md:translate-x-0
          ${className}
        `}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className=" flex items-center justify-center">
              <Logo className="h-10 w-10" />
            </div>

            {!collapsed && (
              <span className="ml-3 text-xl font-semibold">
                <LogoText className="h-40 w-40" />
              </span>
            )}
          </div>
          <button
            className="hidden md:block text-gray-400 hover:text-white"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronRight
              size={20}
              className={`transform transition-transform ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-2 text-sm font-medium rounded-md
                  ${
                    isActive(item.href)
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-[#FFFAF4] hover:text-black"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <item.icon
                  className={`
                    flex-shrink-0 h-6 w-6
                    ${
                      isActive(item.href)
                        ? "text-indigo-400"
                        : "text-gray-400 group-hover:text-black"
                    }
                  `}
                  aria-hidden="true"
                />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className={`flex ${collapsed ? "justify-center" : ""}`}>
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-500" />
            </div>
            {!collapsed && (
              <div className="ml-3">
                <p className="text-sm font-medium text-white">John Doe</p>
                <p className="text-xs text-gray-400">View Profile</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
