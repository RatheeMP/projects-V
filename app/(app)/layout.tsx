import type React from "react"
import { AppHeader } from "@/components/app-header"
import { Sidebar } from "@/components/sidebar"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get session from NextAuth
  const session = await getServerSession(authOptions)

  // If not authenticated, redirect to signin
  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={session.user} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
        <Sidebar className="hidden md:block" />
        <main className="flex w-full flex-col overflow-hidden">{children}</main>
      </div>
    </div>
  )
}
