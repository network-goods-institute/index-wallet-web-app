import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google"
import { IndexHeader } from "@/components/index-header"

// Plus Jakarta Sans is a rounded sans-serif font similar to SF Pro Rounded
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "block", // Wait for font to load before showing text
  preload: true,
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "block", // Wait for font to load before showing text
  preload: true,
})

export const metadata: Metadata = {
  title: "Index Wallets - Fund Public Goods",
  description: "Vote with your wallet. Support public goods that matter.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${playfair.variable} font-sans`}>
        <div className="flex min-h-screen flex-col">
          <IndexHeader />
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                © {new Date().getFullYear()} Index Wallets
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
