// app/api/users/[id]/resumes/route.ts - Enhanced with blob deletion
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import { del } from '@vercel/blob';

// GET all resumes for a user
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const isOwnProfile = session.user.id === id;

    if (!isOwnProfile) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const user = await User.findById(id).select('resumes');

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ resumes: user.resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json({ message: "Error fetching resumes" }, { status: 500 });
  }
}

// POST - Add a new resume
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await req.json();
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const isOwnProfile = session.user.id === id;

    if (!isOwnProfile) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { url, filename, isDefault } = body;

    if (!url || !filename) {
      return NextResponse.json(
        { message: "Resume URL and filename are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // If this is set as default, unset all other defaults
    if (isDefault) {
      user.resumes.forEach((resume: any) => {
        resume.isDefault = false;
      });
    }

    // Add new resume
    user.resumes.push({
      url,
      filename,
      uploadedAt: new Date(),
      isDefault: isDefault || user.resumes.length === 0 // First resume is default
    });

    await user.save();

    return NextResponse.json({ 
      message: "Resume added successfully",
      resumes: user.resumes
    });
  } catch (error) {
    console.error("Error adding resume:", error);
    return NextResponse.json({ message: "Error adding resume" }, { status: 500 });
  }
}

// DELETE a resume
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('resumeId');
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id) || !resumeId) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const isOwnProfile = session.user.id === id;

    if (!isOwnProfile) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const resumeIndex = user.resumes.findIndex((r: any) => r._id?.toString() === resumeId);

    if (resumeIndex === -1) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    const resume = user.resumes[resumeIndex];
    const wasDefault = resume.isDefault;

    // Delete from Vercel Blob
    if (resume.url) {
      try {
        console.log('Deleting blob:', resume.url);
        await del(resume.url);
        console.log('✅ Blob deleted successfully');
      } catch (error) {
        console.error('⚠️ Failed to delete blob:', error);
        // Continue anyway - we'll still remove from database
      }
    }

    // Remove resume from array
    user.resumes.splice(resumeIndex, 1);

    // If deleted resume was default and there are other resumes, make the first one default
    if (wasDefault && user.resumes.length > 0) {
      user.resumes[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({ 
      message: "Resume deleted successfully",
      resumes: user.resumes
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return NextResponse.json({ message: "Error deleting resume" }, { status: 500 });
  }
}

// PATCH - Set default resume
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;
    const body = await req.json();
    
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
    }

    const isOwnProfile = session.user.id === id;

    if (!isOwnProfile) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { resumeId } = body;

    if (!resumeId) {
      return NextResponse.json({ message: "Resume ID is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Unset all defaults
    user.resumes.forEach((resume: any) => {
      resume.isDefault = false;
    });

    // Set new default
    const resume = user.resumes.find((r: any) => r._id?.toString() === resumeId);

    if (!resume) {
      return NextResponse.json({ message: "Resume not found" }, { status: 404 });
    }

    resume.isDefault = true;

    await user.save();

    return NextResponse.json({ 
      message: "Default resume updated",
      resumes: user.resumes
    });
  } catch (error) {
    console.error("Error updating default resume:", error);
    return NextResponse.json({ message: "Error updating default resume" }, { status: 500 });
  }
}