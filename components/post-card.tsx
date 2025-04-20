"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Heart, MessageCircle, MoreHorizontal, Share2, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { CommentList } from "@/components/comment-list"
import { createComment } from "@/app/actions/comment-actions"
import { useSession } from "next-auth/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Post {
  id: string
  user: {
    id: string
    name: string
    username?: string
    image?: string
    email?: string
  }
  content: string
  imageUrl?: string
  _count?: {
    likes: number
    comments: number
  }
  comments?: any[]
  createdAt: string | Date
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { data: session, status } = useSession()
  const { toast } = useToast()
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [moderationError, setModerationError] = useState<{
    message: string
    explanation?: string
    suggestedRevision?: string
  } | null>(null)

  // Check if user is authenticated
  const isAuthenticated = status === "authenticated"

  const handleLike = () => {
    if (liked) {
      setLiked(false)
      setLikesCount(likesCount - 1)
    } else {
      setLiked(true)
      setLikesCount(likesCount + 1)
    }
  }

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return

    setIsSubmitting(true)
    setModerationError(null)

    try {
      const formData = new FormData()
      formData.append("content", commentText)
      formData.append("postId", post.id)

      const result = await createComment(formData)

      if (result.success) {
        toast({
          title: "Comment posted",
          description: result.hasWarning
            ? "Your comment has been posted with a sensitivity warning."
            : "Your comment has been posted successfully.",
        })

        setCommentText("")
        setShowComments(true)
        // Refresh comments (in a real app, you'd fetch the updated comments)
      } else {
        // Handle moderation rejection
        setModerationError({
          message: result.message,
          explanation: result.explanation,
          suggestedRevision: result.suggestedRevision,
        })

        toast({
          title: "Comment not posted",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error posting your comment.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar>
          <AvatarImage src={post.user.image || "/placeholder.svg?height=40&width=40&query=user"} alt={post.user.name} />
          <AvatarFallback>{post.user.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium leading-none">{post.user.name}</p>
              <p className="text-sm text-muted-foreground">@{post.user.username}</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </div>
          <p className="text-sm">{post.content}</p>
        </div>
      </CardHeader>
      {post.imageUrl && (
        <CardContent className="px-0">
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src={post.imageUrl || "/placeholder.svg?height=400&width=600&query=landscape"}
              alt="Post image"
              className="h-full w-full object-cover"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                // If image fails to load, replace with placeholder
                e.currentTarget.src = "/mountain-valley-vista.png"
              }}
            />
          </div>
        </CardContent>
      )}
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className={`gap-1 ${liked ? "text-red-500" : ""}`} onClick={handleLike}>
            <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
            <span>{likesCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4" />
            <span>{post._count?.comments || 0}</span>
          </Button>
          <Button variant="ghost" size="sm" className="gap-1">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <div className="ml-auto text-xs text-muted-foreground">
            {typeof post.createdAt === "string" ? post.createdAt : new Date(post.createdAt).toLocaleString()}
          </div>
        </div>
        {showComments && (
          <div className="w-full space-y-4">
            <CommentList postId={post.id} comments={post.comments} />
            {isAuthenticated ? (
              <>
                {moderationError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Comment Blocked</AlertTitle>
                    <AlertDescription>
                      <p>{moderationError.explanation || moderationError.message}</p>
                      {moderationError.suggestedRevision && (
                        <div className="mt-2">
                          <p className="font-semibold">Suggested revision:</p>
                          <p className="italic">{moderationError.suggestedRevision}</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => {
                              setCommentText(moderationError.suggestedRevision || "")
                              setModerationError(null)
                            }}
                          >
                            Use suggestion
                          </Button>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[80px] flex-1"
                  />
                  <Button
                    onClick={handleSubmitComment}
                    disabled={!commentText.trim() || isSubmitting}
                    className="self-end"
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-center text-sm text-muted-foreground">Sign in to comment</p>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
