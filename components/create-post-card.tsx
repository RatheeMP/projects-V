"use client"

import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ImageIcon, Smile, X, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { createPost } from "@/app/actions/post-actions"
import { uploadImage } from "@/app/actions/upload-actions"
import { Progress } from "@/components/ui/progress"

export function CreatePostCard() {
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadProgress(10) // Start progress

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Simulate progress (in a real app, you might use an upload hook with progress)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const result = await uploadImage(formData)

      clearInterval(progressInterval)

      if (result.success) {
        setUploadProgress(100)
        setImage(result.url)
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        })
      } else {
        toast({
          title: "Upload failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error uploading your image.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async () => {
    if (!content.trim() && !image) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("content", content)
      if (image) {
        formData.append("imageUrl", image)
      }

      const result = await createPost(formData)

      if (result.success) {
        toast({
          title: "Post created",
          description: "Your post has been created successfully.",
        })

        setContent("")
        setImage(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } else {
        toast({
          title: "Post not created",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "There was an error creating your post.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="/vibrant-street-market.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {isUploading && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Uploading image...</span>
                </div>
                <Progress value={uploadProgress} className="h-2 w-full" />
              </div>
            )}
            {image && !isUploading && (
              <div className="relative mt-2">
                <img
                  src={image || "/placeholder.svg"}
                  alt="Uploaded"
                  className="max-h-[300px] rounded-md object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute right-2 top-2 h-6 w-6"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <input
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
            disabled={isUploading}
          />
          <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <ImageIcon className="mr-2 h-4 w-4" />
            Photo
          </Button>
          <Button variant="ghost" size="sm">
            <Smile className="mr-2 h-4 w-4" />
            Emoji
          </Button>
        </div>
        <Button onClick={handleSubmit} disabled={(!content.trim() && !image) || isSubmitting || isUploading}>
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  )
}
