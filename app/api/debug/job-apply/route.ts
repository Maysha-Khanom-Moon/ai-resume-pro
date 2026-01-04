// app/api/debug/job-apply/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Job } from '@/models/Job';
import { User } from '@/models/User';
import { auth } from '@/auth';
import mongoose from 'mongoose';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      session: {
        exists: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email,
        userDetails: undefined as any,
      },
      request: {
        body: body,
        userId: body.userId,
        jobId: body.jobId,
        resumeUrl: body.resumeUrl,
      },
      validation: {
        hasUserId: !!body.userId,
        hasJobId: !!body.jobId,
        hasResumeUrl: !!body.resumeUrl,
        userIdIsValid: body.userId ? mongoose.Types.ObjectId.isValid(body.userId) : false,
        jobIdIsValid: body.jobId ? mongoose.Types.ObjectId.isValid(body.jobId) : false,
        idsMatch: session?.user?.id === body.userId,
      },
      database: {
        connected: false,
        userExists: false,
        jobExists: false,
        userIsRecruiter: false,
        alreadyApplied: false,
      }
    };

    // Connect to database
    await connectDB();
    debugInfo.database.connected = true;

    // Check user
    if (body.userId && mongoose.Types.ObjectId.isValid(body.userId)) {
      const user = await User.findById(body.userId);
      debugInfo.database.userExists = !!user;
      
      if (user) {
        debugInfo.session.userDetails = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          resumesCount: user.resumes?.length || 0,
        };
      }
    }

    // Check job
    if (body.jobId && mongoose.Types.ObjectId.isValid(body.jobId)) {
      const job = await Job.findById(body.jobId);
      debugInfo.database.jobExists = !!job;
      
      if (job) {
        debugInfo.database.userIsRecruiter = job.recruiter.toString() === body.userId;
        debugInfo.database.alreadyApplied = job.applicants.some(
          (applicant: any) => applicant.user.toString() === body.userId
        );
        
        (debugInfo as any).job = {
          id: job._id.toString(),
          title: job.title,
          recruiterId: job.recruiter.toString(),
          applicantsCount: job.applicants.length,
        };
      }
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo,
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}

// GET version for easy browser testing
export async function GET(req: Request) {
  const session = await auth();
  
  return NextResponse.json({
    session: {
      exists: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
    },
    message: 'Use POST with { userId, jobId, resumeUrl } to debug job application',
  });
}