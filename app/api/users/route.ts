import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import { User } from '@/models/User'
import { auth } from '@/auth'
import bcrypt from 'bcryptjs'
import { NextApiRequest } from 'next'

export async function GET(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    // Only admins can list all users
    const isAdmin = session.user.role?.includes('admin')
    if (!isAdmin) {
      return NextResponse.json(
        { message: "Forbidden: Admin access required" },
        { status: 403 }
      )
    }

    await connectDB()

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const role = searchParams.get('role') || ''

    // Build query
    const query: any = {}
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }
    
    if (role) {
      query.role = role
    }

    // Get total count
    const total = await User.countDocuments(query)

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { 
        success: false,
        message: "Error fetching users",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { provider, name, email, password } = await req.json()

    await connectDB()

    // Handling different types of user creation based on provider
    if (provider === 'google' || provider === 'github') {
      // Third-party provider authentication (Google or GitHub)
      if (!email) {
        return NextResponse.json(
          { message: "Email is required" },
          { status: 400 }
        )
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        )
      }

      // Create new user for Google/GitHub auth (no password needed)
      const newUser = new User({
        email,
        name: name || email,  // Use email as name if not provided
        provider,
        createdAt: new Date()
      })

      await newUser.save()
      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      )
    }

    if (provider === 'credentials') {
      // Credentials-based user creation (email, name, password)
      if (!name || !email || !password) {
        return NextResponse.json(
          { message: "Name, email, and password are required" },
          { status: 400 }
        )
      }

      // Check if the user already exists
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        )
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10)

      // Create new user
      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        provider: 'credentials',  // Set provider to 'credentials' for password-based auth
        createdAt: new Date()
      })

      await newUser.save()
      return NextResponse.json(
        { message: "User created successfully", user: newUser },
        { status: 201 }
      )
    }

    // If provider is invalid
    return NextResponse.json(
      { message: "Invalid provider" },
      { status: 400 }
    )
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { message: "Error creating user", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
