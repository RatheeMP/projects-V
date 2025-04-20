import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FeedFilter } from "@/components/feed-filter"
import { CreatePostCard } from "@/components/create-post-card"
import { PostCard } from "@/components/post-card"

export default async function FeedPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/signin")
  }

  // Sample posts for testing
  const posts = [
    {
      id: "1",
      user: {
        id: "user1",
        name: session.user?.name || "User",
        username: session.user?.name?.toLowerCase() || "user",
        image: session.user?.image || "/vibrant-street-market.png",
      },
      content:
        "Welcome to SafeGram! This is a safe social media platform where harmful content is automatically filtered.",
      imageUrl: "/welcoming-hands.jpg",
      createdAt: "2 hours ago",
      _count: {
        likes: 42,
        comments: 5,
      },
      comments: [],
    },
    {
      id: "2",
      user: {
        id: "user2",
        name: "SafeGram Team",
        username: "safegram",
        image: "/diverse-team-brainstorm.png",
      },
      content:
        "The AI-powered content moderation on this platform is amazing. It keeps the community safe from cyberbullying.",
      imageUrl: "/interconnected-ai-network.jpg",
      createdAt: "4 hours ago",
      _count: {
        likes: 24,
        comments: 3,
      },
      comments: [],
    },
  ]

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Feed</h1>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>

        <FeedFilter />
        <CreatePostCard />

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  )
}
