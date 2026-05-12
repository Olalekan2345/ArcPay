import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ArcPay — Confidential AI Payroll Infrastructure',
  description: 'Automate hiring, payroll, treasury, and global stablecoin payments with privacy-preserving infrastructure on Arc Network.',
  keywords: ['payroll', 'web3', 'stablecoin', 'USDC', 'Arc Network', 'confidential compute', 'fintech', 'crypto payroll'],
  authors: [{ name: 'ArcPay' }],
  openGraph: {
    title: 'ArcPay — Confidential AI Payroll Infrastructure',
    description: 'Automate hiring, payroll, treasury, and global stablecoin payments with privacy-preserving infrastructure on Arc.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
