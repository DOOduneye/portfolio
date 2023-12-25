import type { Metadata } from 'next'

import { Inter } from 'next/font/google'
import './globals.css'

import { cn } from '@/lib/utils'

import Navbar from './(home)/_components/navbar'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/providers/theme-providers'

export const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'David Oduneye',
  description: 'David Oduneye is a third year computer science student at Northeastern University.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className='flex flex-col max-w-2xl px-5 mx-auto my-5 sm:px-10'>
            <Navbar />
            {children}
            <Footer />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
