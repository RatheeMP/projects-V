"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { signIn } from "next-auth/react"
import { sql } from "@/lib/db"

const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function SignUpForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Create user in the database
      const formData = new FormData()
      formData.append("username", values.username)
      formData.append("email", values.email)
      formData.append("password", values.password)

      // Create user in database
      const id = Math.random().toString(36).substring(2, 15)
      await sql`
        INSERT INTO "User" (id, name, email, username, "createdAt", "updatedAt")
        VALUES (${id}, ${values.username}, ${values.email}, ${values.username}, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
      `

      // Sign in with email provider
      const result = await signIn("email", {
        email: values.email,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Error",
          description: "Failed to send sign in link. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Account created",
          description: "A sign in link has been sent to your email address.",
        })
        router.push("/verify-request")
      }
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Error",
        description: "There was an error creating your account.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="********" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
        </div>
      </div>
      <Link href="/signin">
        <Button variant="outline" className="w-full">
          Sign In
        </Button>
      </Link>
    </div>
  )
}
