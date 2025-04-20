import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { AppHeader } from "@/components/app-header"
import { getServerSession } from "next-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SafeGram - A Safe Social Media Platform",
  description: "A social media platform that prioritizes user safety",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {session && <AppHeader user={session.user} />}
            <main className="min-h-screen">{children}</main>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
