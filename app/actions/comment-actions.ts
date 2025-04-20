"use server"

import { sql, generateId } from "@/lib/db"
import { analyzeContent, COMMUNITY_GUIDELINES } from "@/lib/content-safety"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"

export async function createComment(formData: FormData) {
  // Get user from NextAuth session
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return { success: false, message: "You must be signed in to comment" }
  }

  const content = formData.get("content") as string
  const postId = formData.get("postId") as string

  if (!content) {
    return { success: false, message: "Comment cannot be empty" }
  }

  try {
    // Get the post to provide context for content moderation
    const posts = await sql`
      SELECT p.content FROM "Post" p WHERE p.id = ${postId}
    `

    if (posts.length === 0) {
      return { success: false, message: "Post not found" }
    }

    // Get recent comments for context
    const recentComments = await sql`
      SELECT c.content 
      FROM "Comment" c 
      WHERE c."postId" = ${postId} 
      ORDER BY c."createdAt" DESC 
      LIMIT 5
    `

    // Create context for content analysis
    const contentContext = {
      postContent: posts[0].content,
      previousComments: recentComments.map((c: any) => c.content),
      communityGuidelines: COMMUNITY_GUIDELINES,
    }

    // Analyze content with enhanced context awareness
    const safetyResult = await analyzeContent(content, contentContext)

    // Log the analysis for monitoring
    console.log("Content analysis:", {
      content,
      result: safetyResult,
    })

    // If content is harmful, block it
    if (safetyResult.category === "harmful") {
      return {
        success: false,
        message: "Your comment was flagged as harmful and cannot be posted.",
        category: safetyResult.category,
        reason: safetyResult.flaggedReason,
        explanation: safetyResult.explanation,
        suggestedRevision: safetyResult.suggestedRevision,
      }
    }

    // Get user ID from database based on email
    const users = await sql`SELECT id FROM "User" WHERE email = ${session.user.email}`

    if (users.length === 0) {
      // Create user if they don't exist
      await sql`
        INSERT INTO "User" (id, name, email, username, "createdAt", "updatedAt")
        VALUES (${session.user.id || generateId()}, ${session.user.name}, ${session.user.email}, ${session.user.username || session.user.email?.split("@")[0]}, NOW(), NOW())
        ON CONFLICT (email) DO NOTHING
      `

      // Get the user ID again
      const newUsers = await sql`SELECT id FROM "User" WHERE email = ${session.user.email}`
      if (newUsers.length === 0) {
        return { success: false, message: "Failed to create user" }
      }

      var userId = newUsers[0].id
    } else {
      var userId = users[0].id
    }

    const commentId = generateId()

    // Check if the Comment table has the required columns
    const checkColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Comment' 
      AND column_name IN ('hasWarningFlag', 'moderationNotes')
    `

    const hasWarningFlag = checkColumns.some((col: any) => col.column_name === "hasWarningFlag")
    const hasModerationNotes = checkColumns.some((col: any) => col.column_name === "moderationNotes")

    // Create comment
    if (hasWarningFlag && hasModerationNotes) {
      // If the columns exist, use them
      await sql`
        INSERT INTO "Comment" (id, content, "postId", "userId", "createdAt", "updatedAt", "hasWarningFlag", "moderationNotes")
        VALUES (
          ${commentId}, 
          ${content}, 
          ${postId}, 
          ${userId}, 
          NOW(), 
          NOW(), 
          ${safetyResult.category === "neutral"}, 
          ${safetyResult.category === "neutral" ? safetyResult.explanation : null}
        )
      `
    } else {
      // If the columns don't exist, use the basic schema
      await sql`
        INSERT INTO "Comment" (id, content, "postId", "userId", "createdAt", "updatedAt")
        VALUES (${commentId}, ${content}, ${postId}, ${userId}, NOW(), NOW())
      `
    }

    revalidatePath("/feed")
    return {
      success: true,
      message: "Comment added successfully",
      category: safetyResult.category,
      hasWarning: safetyResult.category === "neutral",
    }
  } catch (error) {
    console.error("Error creating comment:", error)
    return { success: false, message: "Failed to add comment" }
  }
}

export async function getComments(postId: string) {
  try {
    // Check if the Comment table has the required columns
    const checkColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'Comment' 
      AND column_name IN ('hasWarningFlag', 'moderationNotes')
    `

    const hasWarningFlag = checkColumns.some((col: any) => col.column_name === "hasWarningFlag")
    const hasModerationNotes = checkColumns.some((col: any) => col.column_name === "moderationNotes")

    let comments

    if (hasWarningFlag && hasModerationNotes) {
      comments = await sql`
        SELECT 
          c.id, 
          c.content, 
          c."createdAt",
          c."hasWarningFlag",
          c."moderationNotes",
          u.id as "userId", 
          u.name as "userName", 
          u.email as "userEmail", 
          u.image as "userImage", 
          u.username as "userUsername"
        FROM "Comment" c
        JOIN "User" u ON c."userId" = u.id
        WHERE c."postId" = ${postId}
        ORDER BY c."createdAt" DESC
      `
    } else {
      comments = await sql`
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
        WHERE c."postId" = ${postId}
        ORDER BY c."createdAt" DESC
      `
    }

    // Format the comments
    return comments.map((comment: any) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      hasWarningFlag: comment.hasWarningFlag || false,
      moderationNotes: comment.moderationNotes || "",
      user: {
        id: comment.userId,
        name: comment.userName,
        email: comment.userEmail,
        image: comment.userImage,
        username: comment.userUsername,
      },
    }))
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}
