"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/ui/NotificationBell";
import { Avatar } from "@/components/ui/Avatar";

const menu = [
  { href: "/habits", label: "Dashboard" },
  { href: "/challenges", label: "Challenges" },
  { href: "/community", label: "Community" },
  { href: "/settings", label: "Settings" },
];

export default function Topbar() {
  const pathname = usePathname();
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-30">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
        {/* App name */}
        <Link href="/habits" className="text-2xl font-extrabold tracking-tight font-sans text-primary-700 dark:text-primary-200">
          Habitual
        </Link>
        {/* Menu links */}
        <nav className="flex-1 flex justify-center gap-8">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base font-medium px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 ${
                pathname === item.href
                  ? "text-primary-700 dark:text-primary-200"
                  : "text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {/* Notification bell and avatar */}
        <div className="flex items-center gap-4">
          <NotificationBell />
          <Avatar emailOrName="user@example.com" size={36} />
        </div>
      </div>
    </header>
  );
} 