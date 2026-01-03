// app/api/jobs/[jobId]/apply/route.ts
import { NextResponse } from 'next/server';
import { Job } from '@/models/Job';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';

export async function POST(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  const { jobId } = params;
  
  try {
    await dbConnect();
    
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if user is the recruiter (can't apply to own job)
    if (job.recruiter.toString() === userId) {
      return NextResponse.json(
        { error: 'You cannot apply to your own job posting' },
        { status: 400 }
      );
    }

    // Check if user already applied
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (job.applicants.some((id: mongoose.Types.ObjectId) => id.equals(userObjectId))) {
      return NextResponse.json(
        { error: 'You have already applied to this job' },
        { status: 400 }
      );
    }

    // Add user to applicants
    job.applicants.push(userObjectId);
    await job.save();

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error applying to job:', error);
    return NextResponse.json({ error: 'Error submitting application' }, { status: 500 });
  }
}