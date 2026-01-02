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
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing email or password")
          return null
        }

        try {
          await connectDB()
          console.log("DB connected, searching for user:", credentials.email)
          
          const user = await User.findOne({ email: credentials.email }).select("+password").lean()
          
          console.log("User found:", user ? "YES" : "NO")
          
          if (!user) {
            console.log("No user with email:", credentials.email)
            return null
          }

          if (!user.password) {
            console.log("User has no password (OAuth user)")
            return null
          }

          console.log("Comparing passwords (plain text)...")
          
          if (user.password !== credentials.password) {
            console.log("Password mismatch!")
            return null
          }

          console.log("✅ Auth successful for:", user.email)
          
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || ["user"],
            image: user.imageLink || "",
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
      console.log("User object:", JSON.stringify(user, null, 2))
      
      try {
        if (!user?.email) {
          console.error("❌ No email provided")
          return false
        }

        // For OAuth providers
        if (account?.provider === "google" || account?.provider === "github") {
          console.log("OAuth sign in detected")
          
          await connectDB()
          console.log("✓ DB connected")
          
          let existingUser = await User.findOne({ email: user.email }).lean()
          console.log("Existing user:", existingUser ? "Found" : "Not found")
          
          if (!existingUser) {
            console.log("Creating new user...")
            
            const isAdmin = user.email === "maysha412@gmail.com"
            
            const userData = {
              name: user.name || user.email.split('@')[0],
              email: user.email,
              role: isAdmin ? ["admin", "user"] : ["user"],
              provider: account.provider,
              imageLink: user.image || "",
            }
            
            console.log("User data to create:", userData)
            
            const newUser = await User.create(userData)
            existingUser = newUser.toObject()
            
            console.log("✓ User created:", existingUser._id)
          } else {
            console.log("✓ Existing user found:", existingUser._id)
            
            // Update image if changed
            if (user.image && existingUser.imageLink !== user.image) {
              console.log("Updating profile image...")
              await User.findByIdAndUpdate(existingUser._id, { imageLink: user.image })
            }
            
            // Ensure admin role for maysha412@gmail.com
            if (user.email === "maysha412@gmail.com" && !existingUser.role.includes("admin")) {
              console.log("Adding admin role...")
              await User.findByIdAndUpdate(existingUser._id, { role: ["admin", "user"] })
              existingUser.role = ["admin", "user"]
            }
          }
          
          // Set user data for JWT callback
          user.id = existingUser._id.toString()
          user.role = existingUser.role
          user.image = existingUser.imageLink || user.image
          
          console.log("✓ Final user data:", { 
            id: user.id, 
            role: user.role,
            image: user.image 
          })
        }
        
        console.log("=== SIGNIN CALLBACK SUCCESS ===")
        return true
        
      } catch (error) {
        console.error("❌ SignIn callback error:", error)
        console.error("Error details:", error instanceof Error ? error.message : String(error))
        console.error("Stack:", error instanceof Error ? error.stack : "")
        
        // Return true to allow login even if DB operation fails
        return true
      }
    },
    async jwt({ token, user, trigger, session }) {
      console.log("=== JWT CALLBACK ===", { trigger, hasUser: !!user })
      
      if (user) {
        token.id = user.id
        // Convert array to JSON string for JWT
        token.role = JSON.stringify(user.role || ["user"])
        token.image = user.image
        console.log("✓ Token updated with user data")
      }
      
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
        // Parse JSON string back to array
        session.user.role = token.role ? JSON.parse(token.role as string) : ["user"]
        session.user.image = token.image as string | undefined
        console.log("✓ Session updated with token data")
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