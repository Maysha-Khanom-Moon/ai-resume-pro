// app/api/users/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

// GET - Get user profile
export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

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
        role: user.role,
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
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await req.json();
    const {
      name,
      education,
      experience,
      currentJob,
      skills,
      imageLink,
      fbLink,
      githubLink,
      linkedinLink,
      location,
    } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (education) updateData.education = education;
    if (experience) updateData.experience = experience;
    if (currentJob) updateData.currentJob = currentJob;
    if (skills) updateData.skills = skills;
    if (imageLink !== undefined) updateData.imageLink = imageLink;
    if (fbLink !== undefined) updateData.fbLink = fbLink;
    if (githubLink !== undefined) updateData.githubLink = githubLink;
    if (linkedinLink !== undefined) updateData.linkedinLink = linkedinLink;
    if (location !== undefined) updateData.location = location;

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        education: user.education,
        experience: user.experience,
        currentJob: user.currentJob,
        skills: user.skills,
        imageLink: user.imageLink,
        fbLink: user.fbLink,
        githubLink: user.githubLink,
        linkedinLink: user.linkedinLink,
        location: user.location,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}