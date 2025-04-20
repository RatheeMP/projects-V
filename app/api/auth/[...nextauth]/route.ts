import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Simple NextAuth configuration with minimal options
export const authOptions = {
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

        if (!credentials?.email || !allowedEmails.includes(credentials.email)) {
          return null
        }

        return {
          id: credentials.email,
          name: credentials.email.split("@")[0],
          email: credentials.email,
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    error: "/auth-error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-do-not-use-in-production",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
