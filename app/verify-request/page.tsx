import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail } from "lucide-react"

export default function VerifyRequestPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Check your email</CardTitle>
          <CardDescription className="text-center">A sign in link has been sent to your email address.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
          <p>If you don't see it, check your spam folder. The link will expire after 24 hours.</p>
          <p className="text-sm text-muted-foreground">
            You can close this page and click the link in your email to sign in.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/signin">
            <Button variant="outline">Back to Sign In</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
