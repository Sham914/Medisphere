import { CityProvider } from "@/hooks/city-context";
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Medisphere App',
  description: 'Created by Sham',
  generator: 'vs code',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <CityProvider>
          {children}
        </CityProvider>
        <Analytics />
      </body>
    </html>
  )
}
