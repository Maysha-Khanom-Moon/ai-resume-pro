import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"

export const metadata: Metadata = {
  title: "AI Resume Pro",
  description: "AI Resume Pro",
}

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

import { ThemeProvider } from "@/components/theme-provider"
import { SessionProvider } from "next-auth/react"

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <>
      <html lang="en" className={poppins.className} suppressHydrationWarning>
        <head />
        <body>
          <SessionProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
          </SessionProvider>
        </body>
      </html>
    </>
  )
}