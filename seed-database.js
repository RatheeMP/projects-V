import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

// Initialize Supabase client with service role key for admin access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample user data
const users = [
  {
    email: "ratheemeenatchi@gmail.com",
    password: "password123",
    username: "ASHIN S",
    full_name: "ashin sabu",
    bio: "Photography enthusiast | Travel lover",
    avatar_url: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    email: "ratheem.pandiyaraj@gmali.com",
    password: "password123",
    username: "Rathee M",
    full_name: "rathee meenu",
    bio: "Digital artist | Nature lover",
    avatar_url: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    email: "sarah@example.com",
    password: "password123",
    username: "sarahlee",
    full_name: "Sarah Lee",
    bio: "Fitness coach | Healthy lifestyle",
    avatar_url: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    email: "mike@example.com",
    password: "password123",
    username: "mikebrown",
    full_name: "Mike Brown",
    bio: "Tech enthusiast | Gamer",
    avatar_url: "https://randomuser.me/api/portraits/men/5.jpg",
  },
]

// Sample post data
const postTemplates = [
  {
    caption: "Beautiful sunset at the beach",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  },
  {
    caption: "City lights",
    image_url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390",
  },
  {
    caption: "My latest digital art piece",
    image_url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968",
  },
  {
    caption: "Homemade pasta for dinner",
    image_url: "https://images.unsplash.com/photo-1551183053-bf91a1d81141",
  },
  {
    caption: "Morning coffee art",
    image_url: "https://images.unsplash.com/photo-1541167760496-1628856ab772",
  },
  {
    caption: "Today's workout complete!",
    image_url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
  },
  {
    caption: "New gaming setup",
    image_url: "https://images.unsplash.com/photo-1598550476439-6847785fcea6",
  },
]

// Sample comments
const commentTemplates = [
  "Absolutely stunning!",
  "Where is this?",
  "Amazing work!",
  "Looks delicious!",
  "Perfect latte art!",
  "Keep up the good work!",
  "Nice setup!",
  "I love this!",
  "Great shot!",
  "This is awesome!",
]

// Create users and seed data
async function seedDatabase() {
  try {
    console.log("Starting database seeding...")

    // Array to store created user IDs
    const createdUsers = []

    // Step 1: Create users and their profiles
    for (const user of users) {
      console.log(`Creating user: ${user.email}`)

      // Check if user already exists
      const { data: existingUser } = await supabase.from("profiles").select("id").eq("username", user.username).single()

      if (existingUser) {
        console.log(`User ${user.username} already exists, skipping...`)
        createdUsers.push(existingUser.id)
        continue
      }

      // Create user in Auth
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })

      if (authError) {
        console.error(`Error creating user ${user.email}:`, authError)
        continue
      }

      const userId = authUser.user.id
      createdUsers.push(userId)

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        username: user.username,
        full_name: user.full_name,
        bio: user.bio,
        avatar_url: user.avatar_url,
      })

      if (profileError) {
        console.error(`Error creating profile for ${user.username}:`, profileError)
      } else {
        console.log(`Created profile for ${user.username}`)
      }
    }

    // Step 2: Create posts
    console.log("Creating posts...")
    const createdPosts = []

    for (let i = 0; i < createdUsers.length; i++) {
      const userId = createdUsers[i]
      // Each user creates 1-3 posts
      const numPosts = Math.floor(Math.random() * 3) + 1

      for (let j = 0; j < numPosts; j++) {
        const postTemplate = postTemplates[Math.floor(Math.random() * postTemplates.length)]

        const { data: post, error: postError } = await supabase
          .from("posts")
          .insert({
            user_id: userId,
            caption: postTemplate.caption,
            image_url: postTemplate.image_url,
          })
          .select("id")
          .single()

        if (postError) {
          console.error(`Error creating post for user ${userId}:`, postError)
        } else {
          createdPosts.push(post.id)
          console.log(`Created post for user ${userId}`)
        }
      }
    }

    // Step 3: Create comments
    console.log("Creating comments...")

    for (const postId of createdPosts) {
      // Each post gets 0-3 comments
      const numComments = Math.floor(Math.random() * 4)

      for (let i = 0; i < numComments; i++) {
        const commenterId = createdUsers[Math.floor(Math.random() * createdUsers.length)]
        const comment = commentTemplates[Math.floor(Math.random() * commentTemplates.length)]

        const { error: commentError } = await supabase.from("comments").insert({
          post_id: postId,
          user_id: commenterId,
          content: comment,
        })

        if (commentError) {
          console.error(`Error creating comment for post ${postId}:`, commentError)
        }
      }
    }

    // Step 4: Create likes
    console.log("Creating likes...")

    for (const postId of createdPosts) {
      // Each post gets 0-5 likes
      const numLikes = Math.floor(Math.random() * 6)
      const likers = [...createdUsers].sort(() => 0.5 - Math.random()).slice(0, numLikes)

      for (const likerId of likers) {
        const { error: likeError } = await supabase.from("likes").insert({
          post_id: postId,
          user_id: likerId,
        })

        if (likeError) {
          console.error(`Error creating like for post ${postId} by user ${likerId}:`, likeError)
        }
      }
    }

    // Step 5: Create follows
    console.log("Creating follows...")

    for (const followerId of createdUsers) {
      // Each user follows 1-4 other users
      const numFollowing = Math.floor(Math.random() * 4) + 1
      const followingIds = [...createdUsers]
        .filter((id) => id !== followerId) // Can't follow yourself
        .sort(() => 0.5 - Math.random())
        .slice(0, numFollowing)

      for (const followingId of followingIds) {
        const { error: followError } = await supabase.from("follows").insert({
          follower_id: followerId,
          following_id: followingId,
        })

        if (followError) {
          console.error(`Error creating follow relationship from ${followerId} to ${followingId}:`, followError)
        }
      }
    }

    // Step 6: Create conversations and messages
    console.log("Creating conversations and messages...")

    // Create a few conversations between random users
    const numConversations = Math.min(createdUsers.length, 3)

    for (let i = 0; i < numConversations; i++) {
      // Select two random users for a conversation
      const userIndices = [...Array(createdUsers.length).keys()].sort(() => 0.5 - Math.random()).slice(0, 2)

      const user1 = createdUsers[userIndices[0]]
      const user2 = createdUsers[userIndices[1]]

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from("conversations")
        .insert({})
        .select("id")
        .single()

      if (convError) {
        console.error("Error creating conversation:", convError)
        continue
      }

      // Add participants
      await supabase.from("conversation_participants").insert([
        { conversation_id: conversation.id, user_id: user1 },
        { conversation_id: conversation.id, user_id: user2 },
      ])

      // Add messages (3-6 messages per conversation)
      const numMessages = Math.floor(Math.random() * 4) + 3
      const senders = [user1, user2]

      for (let j = 0; j < numMessages; j++) {
        const sender = senders[j % 2] // Alternate between the two users
        const messageContent = `This is message ${j + 1} in the conversation.`

        await supabase.from("messages").insert({
          conversation_id: conversation.id,
          sender_id: sender,
          content: messageContent,
          read: j < numMessages - 2, // Mark all but the last two messages as read
        })
      }
    }

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

// Run the seeding function
seedDatabase()
