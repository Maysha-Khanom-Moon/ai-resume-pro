// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'
import mongoose from 'mongoose'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    await connectDB()

    // Find user and exclude password
    const user = await User.findById(id).select('-password')

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    // Check if user can view this profile
    const isAdmin = session.user.role?.includes('admin')
    const isOwnProfile = session.user.id === id

    // Users can view their own profile or admins can view any profile
    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { message: "Forbidden: You can only view your own profile" },
        { status: 403 }
      )
    }

    return NextResponse.json({ 
      success: true,
      user 
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Error fetching user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = params

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

    // Authorization check
    const isAdmin = session.user.role?.includes('admin')
    const isOwnProfile = session.user.id === id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { message: "Forbidden: You can only edit your own profile" },
        { status: 403 }
      )
    }

    await connectDB()

    // Prepare update object
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    
    // Email validation and uniqueness check
    if (email !== undefined) {
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
    
    // Only admins can update roles (except for maysha412@gmail.com)
    if (role !== undefined && isAdmin) {
      // Prevent removing admin from maysha412@gmail.com
      const user = await User.findById(id)
      if (user?.email === "maysha412@gmail.com" && !role.includes("admin")) {
        return NextResponse.json(
          { message: "Cannot remove admin role from maysha412@gmail.com" },
          { status: 403 }
        )
      }
      updateData.role = role
    }
    
    if (education !== undefined) updateData.education = education
    if (experience !== undefined) updateData.experience = experience
    if (currentJob !== undefined) updateData.currentJob = currentJob
    if (skills !== undefined) updateData.skills = skills
    if (imageLink !== undefined) updateData.imageLink = imageLink
    if (fbLink !== undefined) updateData.fbLink = fbLink
    if (githubLink !== undefined) updateData.githubLink = githubLink
    if (linkedinLink !== undefined) updateData.linkedinLink = linkedinLink
    if (location !== undefined) updateData.location = location

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        message: "User updated successfully", 
        user: updatedUser 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Error updating user",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}