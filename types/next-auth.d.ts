// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string[]
      image?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    name?: string
    role?: string[]
    image?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string  // Stored as JSON string in JWT
    image?: string
  }
}