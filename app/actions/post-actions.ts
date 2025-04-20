"use server"

import { sql, generateId } from "@/lib/db"
import { checkContentSafety } from "@/lib/content-safety"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"

export async function createPost(formData: FormData) {
  const user = await getCurrentUser()

  if (!user) {
    return { success: false, message: "You must be signed in to create a post" }
  }

  const content = formData.get("content") as string
  const imageUrl = formData.get("imageUrl") as string | null

  if (!content && !imageUrl) {
    return { success: false, message: "Post must have content or an image" }
  }

  // Check content safety
  if (content) {
    const safetyCheck = await checkContentSafety(content)

    if (!safetyCheck.isSafe) {
      return {
        success: false,
        message: `Your post was flagged as ${safetyCheck.category}. Please revise your content.`,
        flaggedCategory: safetyCheck.category,
      }
    }
  }

  try {
    const postId = generateId()

    // Create post
    await sql`
      INSERT INTO "Post" (id, content, "imageUrl", "userId", "createdAt", "updatedAt")
      VALUES (${postId}, ${content || ""}, ${imageUrl}, ${user.id}, NOW(), NOW())
    `

    revalidatePath("/feed")
    return { success: true, message: "Post created successfully" }
  } catch (error) {
    console.error("Error creating post:", error)
    return { success: false, message: "Failed to create post" }
  }
}

export async function getPosts() {
  try {
    const posts = await sql`
      SELECT 
        p.id, 
        p.content, 
        p."imageUrl", 
        p."createdAt",
        u.id as "userId", 
        u.name as "userName", 
        u.email as "userEmail", 
        u.image as "userImage", 
        u.username as "userUsername",
        (SELECT COUNT(*) FROM "Like" WHERE "postId" = p.id) as "likesCount",
        (SELECT COUNT(*) FROM "Comment" WHERE "postId" = p.id) as "commentsCount"
      FROM "Post" p
      JOIN "User" u ON p."userId" = u.id
      ORDER BY p."createdAt" DESC
    `

    // Get comments for each post
    const postsWithComments = await Promise.all(
      posts.map(async (post: any) => {
        const comments = await sql`
          SELECT 
            c.id, 
            c.content, 
            c."createdAt",
            u.id as "userId", 
            u.name as "userName", 
            u.email as "userEmail", 
            u.image as "userImage", 
            u.username as "userUsername"
          FROM "Comment" c
          JOIN "User" u ON c."userId" = u.id
          WHERE c."postId" = ${post.id}
          ORDER BY c."createdAt" DESC
          LIMIT 5
        `

        // Format the comments
        const formattedComments = comments.map((comment: any) => ({
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          user: {
            id: comment.userId,
            name: comment.userName,
            email: comment.userEmail,
            image: comment.userImage,
            username: comment.userUsername,
          },
        }))

        // Format the post
        return {
          id: post.id,
          content: post.content,
          imageUrl: post.imageUrl,
          createdAt: post.createdAt,
          user: {
            id: post.userId,
            name: post.userName,
            email: post.userEmail,
            image: post.userImage,
            username: post.userUsername,
          },
          _count: {
            likes: Number.parseInt(post.likesCount),
            comments: Number.parseInt(post.commentsCount),
          },
          comments: formattedComments,
        }
      }),
    )

    return postsWithComments
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}
