// /app/api/jobs/[jobId]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db'; // Ensure DB is connected
import { Job } from '@/models/Job';

// Define the type for the dynamic params
type RouteParams = {
  params: Promise<{ jobId: string }>;
};

export async function GET(req: Request, { params }: RouteParams) {
  // 1. Await params in Next.js 15
  const { jobId } = await params;
  
  try {
    await dbConnect();
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching job post' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  // 1. Await params
  const { jobId } = await params;
  const { title, description, company, location, recruiterId } = await req.json();

  try {
    await dbConnect();
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check authorization
    if (job.recruiter.toString() !== recruiterId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Update job post details
    job.title = title || job.title;
    job.description = description || job.description;
    job.company = company || job.company;
    job.location = location || job.location;

    await job.save();

    return NextResponse.json({ message: 'Job updated successfully', job });
  } catch (error) {
    return NextResponse.json({ error: 'Error updating job post' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  // 1. Await params
  const { jobId } = await params;
  const { recruiterId, role } = await req.json();

  try {
    await dbConnect();
    const job = await Job.findById(jobId);

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if the recruiter is the owner or an admin
    const isAdmin = Array.isArray(role) ? role.includes('admin') : role === 'admin';
    if (job.recruiter.toString() !== recruiterId && !isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // 2. Use deleteOne() instead of remove()
    await Job.findByIdAndDelete(jobId);
    
    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error deleting job post' }, { status: 500 });
  }
}