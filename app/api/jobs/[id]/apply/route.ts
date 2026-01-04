// app/api/jobs/[id]/apply/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Job } from '@/models/Job';
import { User } from '@/models/User';
import { auth } from '@/auth';
import mongoose from 'mongoose';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await params;

    console.log('=== JOB APPLY REQUEST ===');
    console.log('Job ID:', id);
    console.log('Session:', { userId: session?.user?.id, email: session?.user?.email });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid job ID format');
      return NextResponse.json(
        { error: 'Invalid job ID' },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log('Request body:', body);
    
    const { userId, resumeUrl } = body;

    if (!userId || !resumeUrl) {
      console.log('❌ Missing userId or resumeUrl');
      return NextResponse.json(
        { error: 'User ID and resume URL are required' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.log('❌ Invalid user ID format');
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }

    // Verify the authenticated user matches the userId
    if (session.user.id !== userId) {
      console.log('❌ User ID mismatch:', { sessionId: session.user.id, requestId: userId });
      return NextResponse.json(
        { error: 'Forbidden: User ID mismatch' },
        { status: 403 }
      );
    }

    await connectDB();

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Find the job
    const job = await Job.findById(id);

    if (!job) {
      console.log('❌ Job not found');
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    console.log('Job found:', { 
      jobId: job._id, 
      recruiterId: job.recruiter,
      applicantsCount: job.applicants.length 
    });

    // Check if user is the recruiter
    if (job.recruiter.toString() === userId) {
      console.log('❌ User is the recruiter');
      return NextResponse.json(
        { error: 'You cannot apply to your own job posting' },
        { status: 400 }
      );
    }

    // Check if user already applied
    const hasApplied = job.applicants.some(
      (applicant) => applicant.user.toString() === userId
    );

    if (hasApplied) {
      console.log('❌ User already applied');
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Add applicant
    job.applicants.push({
      user: new mongoose.Types.ObjectId(userId),
      resumeUrl,
      appliedAt: new Date(),
    });

    await job.save();
    console.log('✅ Application submitted successfully');

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        job
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error applying to job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to apply to job',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}