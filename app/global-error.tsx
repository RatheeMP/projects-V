"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="container flex h-screen w-screen flex-col items-center justify-center">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tight">Something went wrong!</h1>
            <p className="mb-4 mt-2 text-lg text-muted-foreground">
              An unexpected error occurred. Please try again later.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => reset()}>Try again</Button>
              <Link href="/">
                <Button variant="outline">Go to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
