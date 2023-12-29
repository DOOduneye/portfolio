import './globals.css'
import type { Metadata } from 'next'

import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Gradient } from '@/components/gradient'
import Providers from '@/components/providers/providers'

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
        <Gradient />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
