import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle>Authentication Error</CardTitle>
          <CardDescription>There was a problem with your sign in attempt.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
          <p>This could be because:</p>
          <ul className="list-disc text-left pl-5">
            <li>Your email is not authorized to access this application</li>
            <li>The sign in link has expired or already been used</li>
            <li>There was a technical issue with the authentication service</li>
          </ul>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/signin">
            <Button>Try Again</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
