// app/api/jobs/route.ts
import { NextResponse } from 'next/server';
import { Job } from '@/models/Job';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';

export async function GET() {
  try {
    await dbConnect();
    
    const jobs = await Job.find()
      .populate('recruiter', 'name email company')
      .sort({ createdAt: -1 })
      .lean();
    
    if (!jobs) {
      return NextResponse.json({ error: 'No jobs found' }, { status: 404 });
    }

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Error fetching job posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    
    const { title, description, company, location, recruiterId } = await req.json();

    // Validation
    if (!title || !description || !location || !recruiterId) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    const job = new Job({
      title,
      description,
      company: company || 'Not specified',
      location,
      recruiter: new mongoose.Types.ObjectId(recruiterId),
      applicants: [],
    });

    await job.save();
    
    return NextResponse.json(
      { message: 'Job posted successfully', job }, 
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Error creating job post' }, { status: 500 });
  }
}