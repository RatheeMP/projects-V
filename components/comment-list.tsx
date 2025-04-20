import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AlertTriangle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Comment {
  id: string
  content: string
  createdAt: string | Date
  hasWarningFlag?: boolean
  moderationNotes?: string
  user: {
    id: string
    name: string
    username?: string
    image?: string
  }
}

interface CommentListProps {
  postId: string
  comments?: Comment[]
}

export function CommentList({ postId, comments = [] }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="text-center text-sm text-muted-foreground">No comments yet</p>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.user.image || "/placeholder.svg?height=32&width=32"} alt={comment.user.name} />
            <AvatarFallback>{comment.user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{comment.user.name}</span>
              <span className="text-xs text-muted-foreground">
                {typeof comment.createdAt === "string"
                  ? comment.createdAt
                  : new Date(comment.createdAt).toLocaleString()}
              </span>

              {comment.hasWarningFlag && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">
                        {comment.moderationNotes || "This comment has been flagged as potentially sensitive."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
