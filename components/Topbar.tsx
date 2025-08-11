"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
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
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  
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
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <NotificationBell />
          <Avatar emailOrName="user@example.com" size={36} />
        </div>
      </div>
    </header>
  );
} 