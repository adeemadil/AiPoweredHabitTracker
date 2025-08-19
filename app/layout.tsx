import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Topbar from "@/components/Topbar";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","700","800"] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={plusJakarta.className}>
        {/* Providers wraps Clerk, tRPC, and QueryClient providers */}
        <Providers>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Topbar />
            <main className="flex flex-col items-center px-4 py-8 w-full max-w-6xl mx-auto">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
