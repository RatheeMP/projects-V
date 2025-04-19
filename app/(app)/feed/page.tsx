import { PostCard } from "@/components/post-card"
import { CreatePostCard } from "@/components/create-post-card"
import { FeedFilter } from "@/components/feed-filter"
import { getPosts } from "@/app/actions/post-actions"
import { formatDistanceToNow } from "date-fns"
import { requireAuth } from "@/lib/auth"

export default async function FeedPage() {
  // Require authentication
  const user = await requireAuth()

  const posts = await getPosts()

  // Format the posts for the PostCard component
  const formattedPosts = posts.map((post) => ({
    ...post,
    createdAt: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
    image: post.imageUrl,
  }))

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex flex-col gap-4">
        <FeedFilter />
        <CreatePostCard />
        {formattedPosts.length > 0 ? (
          formattedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No posts yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  )
}
