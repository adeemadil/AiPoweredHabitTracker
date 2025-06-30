"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, ListChecks, Users } from "lucide-react"; // Lucide icons

export default function SidebarNav() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    {
      href: "/habits",
      label: "Habits",
      icon: <ListChecks className="w-6 h-6" />,
    },
    {
      href: "/friends",
      label: "Friends",
      icon: <Users className="w-6 h-6" />,
    },
    // Future: { href: "/notifications", label: "Notifications" },
  ];

  return (
    <nav
      className={`sticky top-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-20 ${
        collapsed ? "w-20" : "w-56"
      }`}
    >
      {/* Hamburger for collapse/expand */}
      <button
        className="p-3 focus:outline-none mb-4 self-start"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        onClick={() => setCollapsed((c) => !c)}
      >
        <Menu className="w-6 h-6" />
      </button>
      <div
        className={`mb-8 text-2xl font-bold text-primary-700 dark:text-primary-300 transition-all duration-300 ${
          collapsed ? "text-center text-xl" : ""
        }`}
      >
        {!collapsed && "Habit Tracker"}
      </div>
      <ul className="flex flex-col gap-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.icon}
              <span
                className={`transition-all duration-200 ${
                  collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto ml-2"
                }`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
