// app/api/users/edit/[id]/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'
import mongoose from 'mongoose'

export async function PUT(
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

    const body = await req.json()
    const {
      name,
      email,
      role,
      education,
      experience,
      currentJob,
      skills,
      imageLink,
      fbLink,
      githubLink,
      linkedinLink,
      location,
    } = body

    // Authorization: Users can only edit their own profile unless they're admin
    const isAdmin = session.user.role?.includes('admin')
    if (!isAdmin && session.user.id !== id) {
      return NextResponse.json(
        { message: "Forbidden: You can only edit your own profile" },
        { status: 403 }
      )
    }

    await connectDB()

    // Prepare update object (only include provided fields)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) {
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { message: "Invalid email format" },
          { status: 400 }
        )
      }
      // Check if email is already taken
      const existingUser = await User.findOne({ email, _id: { $ne: id } })
      if (existingUser) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 409 }
        )
      }
      updateData.email = email
    }
    
    // Only admins can update roles
    if (role !== undefined && isAdmin) updateData.role = role
    if (education !== undefined) updateData.education = education
    if (experience !== undefined) updateData.experience = experience
    if (currentJob !== undefined) updateData.currentJob = currentJob
    if (skills !== undefined) updateData.skills = skills
    if (imageLink !== undefined) updateData.imageLink = imageLink
    if (fbLink !== undefined) updateData.fbLink = fbLink
    if (githubLink !== undefined) updateData.githubLink = githubLink
    if (linkedinLink !== undefined) updateData.linkedinLink = linkedinLink
    if (location !== undefined) updateData.location = location

    // Find and update the user by ID
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "User updated successfully", user },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { message: "Error updating user", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}