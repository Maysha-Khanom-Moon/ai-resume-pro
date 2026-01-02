// app/api/users/create/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models/User'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    await connectDB()

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 })
    }

    // Create a new user
    const user = new User({
      name,
      email,
      password, // Plain text password
      role: ["user"], // Default role
    })

    await user.save()

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Error creating user" }, { status: 500 })
  }
}
