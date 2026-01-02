// app/api/users/delete/[id]/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'
import mongoose from 'mongoose'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid user ID" },
        { status: 400 }
      )
    }

    // Authorization: Only admins can delete users, or users can delete their own account
    const isAdmin = session.user.role?.includes('admin')
    if (!isAdmin && session.user.id !== id) {
      return NextResponse.json(
        { message: "Forbidden: You don't have permission to delete this user" },
        { status: 403 }
      )
    }

    await connectDB()

    // Find and delete the user by ID
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { message: "Error deleting user", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}