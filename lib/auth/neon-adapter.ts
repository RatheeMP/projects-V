import type { Adapter } from "next-auth/adapters"
import { sql } from "@/lib/db"
import { generateId } from "@/lib/db"

export function NeonAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = generateId()
      const email = user.email
      const name = user.name || email?.split("@")[0] || "User"
      const username = email?.split("@")[0] || `user_${id.substring(0, 8)}`

      const result = await sql`
        INSERT INTO "User" (
          id, 
          name, 
          email, 
          "emailVerified", 
          image, 
          username,
          "createdAt",
          "updatedAt"
        ) 
        VALUES (
          ${id}, 
          ${name}, 
          ${email}, 
          ${user.emailVerified ? new Date(user.emailVerified) : null}, 
          ${user.image}, 
          ${username},
          NOW(),
          NOW()
        )
        RETURNING 
          id, 
          name, 
          email, 
          "emailVerified", 
          image, 
          username
      `

      const createdUser = result[0]
      return {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        emailVerified: createdUser.emailVerified ? new Date(createdUser.emailVerified) : null,
        image: createdUser.image,
        username: createdUser.username,
      }
    },

    async getUser(id) {
      const result = await sql`
        SELECT id, name, email, "emailVerified", image, username
        FROM "User"
        WHERE id = ${id}
      `

      if (result.length === 0) return null

      const user = result[0]
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        username: user.username,
      }
    },

    async getUserByEmail(email) {
      const result = await sql`
        SELECT id, name, email, "emailVerified", image, username
        FROM "User"
        WHERE email = ${email}
      `

      if (result.length === 0) return null

      const user = result[0]
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        username: user.username,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const result = await sql`
        SELECT u.id, u.name, u.email, u."emailVerified", u.image, u.username
        FROM "User" u
        JOIN "Account" a ON u.id = a."userId"
        WHERE a."providerAccountId" = ${providerAccountId}
        AND a.provider = ${provider}
      `

      if (result.length === 0) return null

      const user = result[0]
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
        image: user.image,
        username: user.username,
      }
    },

    async updateUser(user) {
      const result = await sql`
        UPDATE "User"
        SET 
          name = ${user.name || null}, 
          email = ${user.email || null}, 
          "emailVerified" = ${user.emailVerified ? new Date(user.emailVerified) : null}, 
          image = ${user.image || null},
          "updatedAt" = NOW()
        WHERE id = ${user.id}
        RETURNING id, name, email, "emailVerified", image, username
      `

      const updatedUser = result[0]
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        emailVerified: updatedUser.emailVerified ? new Date(updatedUser.emailVerified) : null,
        image: updatedUser.image,
        username: updatedUser.username,
      }
    },

    async deleteUser(userId) {
      await sql`DELETE FROM "User" WHERE id = ${userId}`
      return
    },

    async linkAccount(account) {
      await sql`
        INSERT INTO "Account" (
          id,
          "userId",
          type,
          provider,
          "providerAccountId",
          refresh_token,
          access_token,
          expires_at,
          token_type,
          scope,
          id_token,
          session_state
        )
        VALUES (
          ${generateId()},
          ${account.userId},
          ${account.type},
          ${account.provider},
          ${account.providerAccountId},
          ${account.refresh_token || null},
          ${account.access_token || null},
          ${account.expires_at || null},
          ${account.token_type || null},
          ${account.scope || null},
          ${account.id_token || null},
          ${account.session_state || null}
        )
      `
      return account
    },

    async unlinkAccount({ providerAccountId, provider }) {
      await sql`
        DELETE FROM "Account"
        WHERE "providerAccountId" = ${providerAccountId}
        AND provider = ${provider}
      `
      return
    },

    async createSession({ sessionToken, userId, expires }) {
      await sql`
        INSERT INTO "Session" (
          id,
          "sessionToken",
          "userId",
          expires
        )
        VALUES (
          ${generateId()},
          ${sessionToken},
          ${userId},
          ${expires}
        )
      `
      return {
        sessionToken,
        userId,
        expires,
      }
    },

    async getSessionAndUser(sessionToken) {
      const result = await sql`
        SELECT 
          s."sessionToken",
          s."userId",
          s.expires,
          u.id,
          u.name,
          u.email,
          u."emailVerified",
          u.image,
          u.username
        FROM "Session" s
        JOIN "User" u ON s."userId" = u.id
        WHERE s."sessionToken" = ${sessionToken}
      `

      if (result.length === 0) return null

      const session = result[0]
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: new Date(session.expires),
        },
        user: {
          id: session.id,
          name: session.name,
          email: session.email,
          emailVerified: session.emailVerified ? new Date(session.emailVerified) : null,
          image: session.image,
          username: session.username,
        },
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const result = await sql`
        UPDATE "Session"
        SET
          "userId" = ${userId},
          expires = ${expires}
        WHERE "sessionToken" = ${sessionToken}
        RETURNING "sessionToken", "userId", expires
      `

      if (result.length === 0) return null

      const session = result[0]
      return {
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: new Date(session.expires),
      }
    },

    async deleteSession(sessionToken) {
      await sql`DELETE FROM "Session" WHERE "sessionToken" = ${sessionToken}`
      return
    },

    async createVerificationToken({ identifier, expires, token }) {
      await sql`
        INSERT INTO "VerificationToken" (
          identifier,
          token,
          expires
        )
        VALUES (
          ${identifier},
          ${token},
          ${expires}
        )
      `
      return {
        identifier,
        token,
        expires,
      }
    },

    async useVerificationToken({ identifier, token }) {
      const result = await sql`
        DELETE FROM "VerificationToken"
        WHERE identifier = ${identifier}
        AND token = ${token}
        RETURNING identifier, token, expires
      `

      if (result.length === 0) return null

      const verificationToken = result[0]
      return {
        identifier: verificationToken.identifier,
        token: verificationToken.token,
        expires: new Date(verificationToken.expires),
      }
    },
  }
}
