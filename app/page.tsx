import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold">SafeGram</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/signin">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">Welcome to SafeGram</h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              A social media platform that prioritizes your safety and wellbeing.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
        </section>
        <section className="container py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Safe from Cyberbullying</h2>
              <p className="mt-4 text-muted-foreground">
                Our AI-powered content moderation system detects and blocks harmful content and toxic comments before
                they reach you.
              </p>
            </div>
            <div className="rounded-lg bg-slate-100 p-8 dark:bg-slate-800">
              <div className="space-y-4">
                <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-700">
                  <p className="text-sm">
                    <span className="font-medium">AI Content Moderation:</span> Automatically filters out harmful
                    content
                  </p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-700">
                  <p className="text-sm">
                    <span className="font-medium">Customizable Feed:</span> Choose what you want to see
                  </p>
                </div>
                <div className="rounded-md bg-white p-4 shadow-sm dark:bg-slate-700">
                  <p className="text-sm">
                    <span className="font-medium">User Safety:</span> Protection from cybercrime and harassment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">© 2024 SafeGram. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
