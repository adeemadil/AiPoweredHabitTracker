import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Habitual - Smart Habit Tracker',
  description: 'Build lasting habits with AI insights and social motivation',
  keywords: 'habit tracker, productivity, AI insights, habit building',
  authors: [{ name: 'Habitual Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6EC1E4',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
