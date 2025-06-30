"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarNav() {
  const pathname = usePathname();
  const navItems = [
    { href: "/habits", label: "Habits" },
    { href: "/friends", label: "Friends" },
    // Future: { href: "/notifications", label: "Notifications" },
  ];
  return (
    <nav className="h-full w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-8 px-4">
      <div className="mb-8 text-2xl font-bold text-primary-700 dark:text-primary-300">
        Habit Tracker
      </div>
      <ul className="flex flex-col gap-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`block px-3 py-2 rounded-lg text-lg font-medium transition-colors ${
                pathname.startsWith(item.href)
                  ? "bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-200"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
