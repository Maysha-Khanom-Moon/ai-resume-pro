// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import connectDB from "@/lib/db"
import { User } from "@/models/User"
import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {
          throw new Error("Email and password are required")
        }

        await connectDB()

        const user = await User.findOne({ email }).select("+password")

        if (!user) {
          throw new Error("No user found with the given email")
        }

        // Use bcrypt.compare() in production
        if (user.password !== password) {
          throw new Error("Incorrect password")
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role, // Include role
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role // Add role to token
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string[] | undefined // Add role to session
      }
      return session
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins (Google, GitHub)
      if (account?.provider === "google" || account?.provider === "github") {
        await connectDB()
        
        const existingUser = await User.findOne({ email: user.email })
        
        if (!existingUser) {
          // Create new user for OAuth
          const newUser = new User({
            name: user.name,
            email: user.email,
            role: ["user"], // Default role for OAuth users
            provider: account.provider,
          })
          await newUser.save()
          
          // Add role to user object
          user.role = ["user"]
        } else {
          // Add existing user's role
          user.role = existingUser.role
        }
      }
      return true
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)