import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/components/TRPCProvider";

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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <TRPCProvider>{children}</TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
} 