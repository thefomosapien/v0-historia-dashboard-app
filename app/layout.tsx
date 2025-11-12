import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Newsreader } from "next/font/google"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
})

export const metadata: Metadata = {
  title: "Historia - Your Life, Week by Week",
  description: "Document and reflect on your life's journey, one week at a time",
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#1E293B",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} ${newsreader.variable} antialiased`}>{children}</body>
    </html>
  )
}
