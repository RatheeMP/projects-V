import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold tracking-tight">404</h1>
        <p className="mb-4 mt-2 text-lg text-muted-foreground">
          Page not found. The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button>Go to Home</Button>
        </Link>
      </div>
    </div>
  )
}
