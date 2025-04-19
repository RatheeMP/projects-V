import { sql, generateId } from "./db"

// Sample posts for seeding
const samplePosts = [
  {
    content:
      "Welcome to SafeGram! This is a safe social media platform where harmful content is automatically filtered.",
    imageUrl: "/welcoming-hands.jpg", // Changed to .jpg
  },
  {
    content: "Just finished setting up my profile. Excited to connect with everyone!",
    imageUrl: null,
  },
  {
    content:
      "The AI-powered content moderation on this platform is amazing. It keeps the community safe from cyberbullying.",
    imageUrl: "/interconnected-ai-network.jpg", // Changed to .jpg
  },
  {
    content: "Enjoying the customizable feed filters. I can choose exactly what type of content I want to see!",
    imageUrl: "/personalized-workspace.jpg", // Changed to .jpg
  },
  {
    content: "Safety first! This platform is designed to protect users from harmful content.",
    imageUrl: null,
  },
]

export async function seedPosts() {
  try {
    // Check if we already have posts
    const existingPosts = await sql`SELECT COUNT(*) as count FROM "Post"`

    if (Number.parseInt(existingPosts[0].count) > 0) {
      console.log("Posts already exist, skipping seed")
      return
    }

    // Get all users
    const users = await sql`SELECT id FROM "User"`

    if (users.length === 0) {
      console.log("No users found, cannot seed posts")
      return
    }

    // Create posts for each user
    for (const user of users) {
      // Select a random post from the sample posts
      const randomPost = samplePosts[Math.floor(Math.random() * samplePosts.length)]

      await sql`
        INSERT INTO "Post" (id, content, "imageUrl", "userId", "createdAt", "updatedAt")
        VALUES (${generateId()}, ${randomPost.content}, ${randomPost.imageUrl}, ${user.id}, NOW(), NOW())
      `
    }

    console.log(`Created ${users.length} posts`)
  } catch (error) {
    console.error("Error seeding posts:", error)
  }
}
