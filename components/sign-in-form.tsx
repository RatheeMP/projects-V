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
import { useRouter } from "next/navigation"
import { signIn as customSignIn } from "@/app/actions/auth-actions"
import { signIn as nextAuthSignIn } from "next-auth/react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export function SignInForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<"credentials" | "email">("credentials")
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
      if (authMethod === "email") {
        // Use NextAuth's email provider
        const result = await nextAuthSignIn("email", {
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
            title: "Check your email",
            description: "A sign in link has been sent to your email address.",
          })
          router.push("/verify-request")
        }
      } else {
        // First try our custom auth
        const formData = new FormData()
        formData.append("email", values.email)

        const result = await customSignIn(formData)

        if (!result.success) {
          // If custom auth fails, try NextAuth credentials
          const nextAuthResult = await nextAuthSignIn("credentials", {
            email: values.email,
            redirect: false,
          })

          if (nextAuthResult?.error) {
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
            router.push("/feed")
            router.refresh()
          }
        } else {
          toast({
            title: "Success",
            description: "You have been signed in.",
          })
          router.push("/feed")
          router.refresh()
        }
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
      <Tabs defaultValue="credentials" onValueChange={(value) => setAuthMethod(value as "credentials" | "email")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="credentials">Quick Sign In</TabsTrigger>
          <TabsTrigger value="email">Email Link</TabsTrigger>
        </TabsList>
        <TabsContent value="credentials">
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

          <div className="mt-4 space-y-4">
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
        </TabsContent>
        <TabsContent value="email">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending link..." : "Send sign in link"}
              </Button>
            </form>
          </Form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            We'll email you a magic link for password-free sign in.
          </p>
        </TabsContent>
      </Tabs>

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
