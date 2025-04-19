"use server"

import { put } from "@vercel/blob"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"
import { generateId } from "@/lib/db"

export async function uploadImage(formData: FormData) {
  try {
    const session = await getServerSession()

    if (!session?.user?.email) {
      return { success: false, message: "You must be signed in to upload images" }
    }

    const file = formData.get("file") as File

    if (!file) {
      return { success: false, message: "No file provided" }
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        message: "Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.",
      }
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: "File too large. Maximum size is 5MB.",
      }
    }

    // Generate a unique filename
    const uniqueId = generateId()
    const fileName = `${uniqueId}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
      addRandomSuffix: false,
    })

    revalidatePath("/feed")

    return {
      success: true,
      url: blob.url,
      message: "Image uploaded successfully",
    }
  } catch (error) {
    console.error("Error uploading image:", error)
    return {
      success: false,
      message: "Failed to upload image. Please try again.",
    }
  }
}
