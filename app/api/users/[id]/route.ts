// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'
import mongoose from 'mongoose'

// GET single user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 })
    }

    // Only allow users to view their own profile or admins to view any
    const isAdmin = session.user.role?.includes('admin')
    const isOwnProfile = session.user.id === id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await connectDB()
    const user = await User.findById(id).select('-password')

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ message: "Error fetching user" }, { status: 500 })
  }
}

// PUT - Update user
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params
    const body = await req.json()

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 })
    }

    // Only allow users to update their own profile or admins to update any
    const isAdmin = session.user.role?.includes('admin')
    const isOwnProfile = session.user.id === id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await connectDB()

    // Prevent regular users from changing their role
    if (!isAdmin && body.role) {
      delete body.role
    }

    // Prevent changing password through this endpoint
    if (body.password) {
      delete body.password
    }

    const user = await User.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "User updated", user })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ message: "Error updating user" }, { status: 500 })
  }
}

// DELETE user
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    const { id } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 })
    }

    await connectDB()
    
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent deleting admin account
    if (user.email === "maysha412@gmail.com") {
      return NextResponse.json({ message: "Cannot delete admin account" }, { status: 403 })
    }

    // Only admin can delete other users, users can delete their own account
    const isAdmin = session.user.role?.includes('admin')
    const isOwnAccount = session.user.id === id

    if (!isAdmin && !isOwnAccount) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await User.findByIdAndDelete(id)
    return NextResponse.json({ message: "User deleted successfully" })
  } catch (error) {
    return NextResponse.json({ message: "Error deleting user" }, { status: 500 })
  }
}