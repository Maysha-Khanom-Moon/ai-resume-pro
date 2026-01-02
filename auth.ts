import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import connectDB from "@/lib/db" // Import the db connection utility
import { User } from "@/models/User" // Import the User model
import { Session } from "next-auth" // Import types from NextAuth

// Define the types for session and user
interface SessionWithUser extends Session {
  user: {
    id: string
    role: string[]
    image: string
  }
}

export const authOptions = {
  providers: [
    // Google provider
    GitHub,
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    // Credentials provider (for email/password authentication)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Connect to the database before querying
        await connectDB()

        // Look for the user in the database by email
        const user = await User.findOne({ email: credentials?.email }).exec()

        // If the user is found and passwords match (no hashing in your case)
        if (user && user.password === credentials?.password) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role, // Add role if needed (admin or user)
            image: user.imageLink, // Add user image link if stored
          }
        }

        // Return null if no user or incorrect password
        return null
      },
    }),
  ],

  // Default session handling (no JWT involved)
  session: {
    strategy: "database", // Ensure correct type of session strategy
  },

  callbacks: {
    // Specify explicit types for session and user
    async session({ session, user }: { session: SessionWithUser, user: any }) {
      if (user) {
        session.user.id = user.id
        session.user.role = user.role
        session.user.image = user.image
      }
      return session
    },
  },

  pages: {
    signIn: "/auth/signin", // Custom sign-in page
  },
}

export default NextAuth(authOptions)
