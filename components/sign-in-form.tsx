"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Default to "/feed" if callbackUrl is not provided or invalid
  const callbackUrl = searchParams?.get("callbackUrl") || "/feed"
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: values.email,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Invalid email or not authorized.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "You have been signed in.",
        })
        // Use a safe path for redirection
        router.push(callbackUrl.startsWith("/") ? callbackUrl : "/feed")
        router.refresh()
      }
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Error",
        description: "There was an error signing in.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Test users for easy login during development
  const testUsers = [
    { email: "user1@example.com" },
    { email: "user2@example.com" },
    { email: "user3@example.com" },
    { email: "user4@example.com" },
    { email: "user5@example.com" },
  ]

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="user1@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Test Users</span>
          </div>
        </div>

        <div className="grid gap-2">
          {testUsers.map((user) => (
            <Button
              key={user.email}
              variant="outline"
              size="sm"
              className="justify-start"
              onClick={() => {
                form.setValue("email", user.email)
                form.handleSubmit(onSubmit)()
              }}
            >
              {user.email}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Don't have an account?</span>
        </div>
      </div>
      <Link href="/signup">
        <Button variant="outline" className="w-full">
          Create an account
        </Button>
      </Link>
    </div>
  )
}
