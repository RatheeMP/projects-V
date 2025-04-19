import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post-card"

export default function ProfilePage() {
  // In a real app, you would fetch user data and posts from your API
  const user = {
    id: "user1",
    name: "John Doe",
    username: "johndoe",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Software developer and photography enthusiast.",
    followers: 245,
    following: 120,
    posts: 42,
  }

  const posts = [
    {
      id: "1",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      content: "Just finished my morning hike! The view was amazing. #nature #hiking",
      image: "/placeholder.svg?height=400&width=600",
      likes: 42,
      comments: 5,
      createdAt: "2h ago",
    },
    {
      id: "2",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        avatar: user.avatar,
      },
      content: "Working on a new project. Can't wait to share it with you all!",
      image: null,
      likes: 24,
      comments: 3,
      createdAt: "4h ago",
    },
  ]

  return (
    <div className="py-6">
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2 text-center md:text-left">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
              </div>
              <p>{user.bio}</p>
              <div className="flex justify-center gap-4 md:justify-start">
                <div className="text-center">
                  <p className="font-bold">{user.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{user.followers}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-bold">{user.following}</p>
                  <p className="text-xs text-muted-foreground">Following</p>
                </div>
              </div>
            </div>
            <Button className="md:self-start">Edit Profile</Button>
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="posts">
        <TabsList className="mb-4">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="tagged">Tagged</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
        <TabsContent value="saved">
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No saved posts yet.</p>
          </div>
        </TabsContent>
        <TabsContent value="tagged">
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-muted-foreground">No tagged posts yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
