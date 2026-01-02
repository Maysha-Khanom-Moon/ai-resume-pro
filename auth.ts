// auth.ts
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import connectDB from "@/lib/db"
import { User } from "@/models/User"
import type { NextAuthConfig } from "next-auth"

console.log("Environment check:", {
  hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
  hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  hasAuthSecret: !!process.env.AUTH_SECRET,
  hasAuthUrl: !!process.env.AUTH_URL,
  hasMongoUri: !!process.env.MONGODB_URI,
})

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      },
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email || "",
          image: profile.avatar_url,
        }
      },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("=== CREDENTIALS AUTH START ===")
        try {
          const email = credentials?.email as string
          const password = credentials?.password as string

          if (!email || !password) {
            console.log("Missing credentials")
            return null
          }

          console.log("Connecting to DB...")
          await connectDB()
          console.log("DB connected")

          console.log("Finding user:", email)
          const user = await User.findOne({ email }).select("+password")

          if (!user) {
            console.log("User not found")
            return null
          }

          if (!user.password) {
            console.log("User has no password (OAuth user)")
            return null
          }

          console.log("Comparing passwords (plain text)...")
          // Plain password comparison
          if (user.password !== password) {
            console.log("Invalid password")
            return null
          }

          console.log("Auth successful for:", user.email)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.imageLink,
          }
        } catch (error) {
          console.error("Authorize error:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log("=== SIGNIN CALLBACK START ===")
      console.log("User:", user?.email)
      console.log("Provider:", account?.provider)
      console.log("Profile image:", user?.image)
      
      try {
        if (!user?.email) {
          console.error("❌ No email provided")
          return false
        }

        // For OAuth providers
        if (account?.provider === "google" || account?.provider === "github") {
          console.log("OAuth sign in detected")
          
          console.log("Connecting to DB...")
          await connectDB()
          console.log("✓ DB connected")
          
          console.log("Looking for existing user...")
          let existingUser = await User.findOne({ email: user.email })
          
          if (!existingUser) {
            console.log("User not found, creating new user...")
            
            // Check if email is admin
            const isAdmin = user.email === "maysha412@gmail.com"
            
            const userData = {
              name: user.name || user.email.split('@')[0],
              email: user.email,
              role: isAdmin ? ["admin", "user"] : ["user"],
              provider: account.provider,
              imageLink: user.image || "",
            }
            
            console.log("Creating user with data:", userData)
            
            existingUser = await User.create(userData)
            
            console.log("✓ User created:", existingUser._id)
          } else {
            console.log("✓ Existing user found:", existingUser._id)
            
            // Update profile image if it changed
            if (user.image && existingUser.imageLink !== user.image) {
              console.log("Updating profile image...")
              existingUser.imageLink = user.image
              await existingUser.save()
              console.log("✓ Profile image updated")
            }
            
            // Ensure admin role for maysha412@gmail.com
            if (user.email === "maysha412@gmail.com" && !existingUser.role.includes("admin")) {
              console.log("Adding admin role...")
              existingUser.role = ["admin", "user"]
              await existingUser.save()
              console.log("✓ Admin role added")
            }
          }
          
          user.id = existingUser._id.toString()
          user.role = existingUser.role
          user.image = existingUser.imageLink
          
          console.log("✓ User data set:", { 
            id: user.id, 
            role: user.role,
            image: user.image 
          })
        }
        
        console.log("=== SIGNIN CALLBACK SUCCESS ===")
        return true
      } catch (error) {
        console.error("❌ SignIn callback error:", error)
        if (error instanceof Error) {
          console.error("Error message:", error.message)
          console.error("Error stack:", error.stack)
        }
        return false
      }
    },
    async jwt({ token, user, trigger, session }) {
      console.log("=== JWT CALLBACK ===", { trigger, hasUser: !!user })
      
      if (user) {
        token.id = user.id
        token.role = user.role
        token.image = user.image
        console.log("✓ Token updated with user data including image")
      }
      
      // Handle session update trigger
      if (trigger === "update" && session) {
        token.name = session.name
        token.image = session.image
        console.log("✓ Token updated from session")
      }
      
      return token
    },
    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===")
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string[] | undefined
        session.user.image = token.image as string | undefined
        console.log("✓ Session updated with token data including image")
      }
      
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: true,
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)