import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SidebarNav from "@/components/SidebarNav";
import NotificationBell from "@/components/ui/NotificationBell";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI-Powered Habit Tracker",
  description: "Track your habits with AI-powered suggestions and motivation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Providers wraps Clerk, tRPC, and QueryClient providers */}
        <Providers>
          <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
            <SidebarNav />
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-end gap-4 px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
                <NotificationBell />
                {/* Future: Profile avatar here */}
              </div>
              <main className="flex-1 p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
