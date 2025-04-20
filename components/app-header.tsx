"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Bell, Home, Menu, MessageSquare, Plus, Search, User } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from "next-auth/react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/sidebar"

interface AppHeaderProps {
  user?: {
    name?: string
    email?: string
    image?: string
  } | null
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Sidebar className="px-2" />
          </SheetContent>
        </Sheet>
        <Link href="/feed" className="mr-4 flex items-center space-x-2">
          <span className="hidden text-xl font-bold sm:inline-block">SafeGram</span>
        </Link>
        <div className="flex-1 md:grow-0 md:w-[200px] lg:w-[300px]">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/feed">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/create">
                <Plus className="h-5 w-5" />
                <span className="sr-only">Create</span>
              </Link>
            </Button>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || "/placeholder.svg?height=32&width=32"} alt={user.name || "User"} />
                    <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
