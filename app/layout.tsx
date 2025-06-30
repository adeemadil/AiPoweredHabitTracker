import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SidebarNav from "@/components/SidebarNav";

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
            <main className="flex-1 p-6">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
