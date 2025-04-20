import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"

// Create a simple credentials provider that accepts any of our test emails
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const allowedEmails = [
          "user1@example.com",
          "user2@example.com",
          "user3@example.com",
          "user4@example.com",
          "user5@example.com",
        ]

        // Check if the email is in our allowed list
        if (!credentials?.email || !allowedEmails.includes(credentials.email)) {
          return null
        }

        // Return a simple user object
        return {
          id: credentials.email,
          name: credentials.email.split("@")[0],
          email: credentials.email,
          username: credentials.email.split("@")[0],
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/auth-error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string
        session.user.username = (token.username as string) || (token.sub?.split("@")[0] as string)
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username || user.email?.split("@")[0]
      }
      return token
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
