import './globals.css'
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import { ThemeProvider } from '@/components/providers/theme-provider'

export const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'David Oduneye',
  description: 'David Oduneye is a third year computer science student at Northeastern University.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
