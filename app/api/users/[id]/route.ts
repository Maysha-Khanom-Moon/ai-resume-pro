// app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

// GET - Get user by ID (public profile)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const user = await User.findById(params.id).select("-__v");

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        education: user.education,
        experience: user.experience,
        currentJob: user.currentJob,
        skills: user.skills,
        imageLink: user.imageLink,
        fbLink: user.fbLink,
        githubLink: user.githubLink,
        linkedinLink: user.linkedinLink,
        location: user.location,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}