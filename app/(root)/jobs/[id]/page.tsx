// app/jobs/[id]/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import connectDB from '@/lib/db';
import { Job } from '@/models/Job';
import { User } from '@/models/User';
import JobDetailView from '@/components/jobs/JobDetailView';
import mongoose from 'mongoose';

interface JobPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    redirect('/jobs');
  }

  await connectDB();

  // Fetch job with populated recruiter and applicants
  const job = await Job.findById(id)
    .populate('recruiter', 'name email company')
    .populate('applicants.user', 'name email')
    .lean();

  if (!job) {
    redirect('/jobs');
  }

  // Fetch current user
  const user = await User.findById(session.user.id).lean();

  if (!user) {
    redirect('/auth/signin');
  }

  // Check permissions
  const isOwner = job.recruiter._id.toString() === user._id.toString();
  const isAdmin = user.role?.includes('admin');
  
  // Check if user has already applied
  const hasApplied = job.applicants.some(
    (applicant: any) => applicant.user?._id?.toString() === user._id.toString()
  );

  // Transform applicants to have the correct structure for the client component
  const transformedJob = {
    ...job,
    applicants: job.applicants
      .filter((applicant: any) => applicant.user) // Filter out any invalid applicants
      .map((applicant: any) => ({
        _id: applicant._id?.toString() || '',
        user: applicant.user._id.toString(), // Convert back to string ID
        name: applicant.user.name || 'Unknown',
        email: applicant.user.email || '',
        resumeUrl: applicant.resumeUrl,
        appliedAt: applicant.appliedAt?.toISOString()
      }))
  };

  // Convert to plain objects for client component
  const jobData = JSON.parse(JSON.stringify(transformedJob));
  const userData = JSON.parse(JSON.stringify(user));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <JobDetailView
        job={jobData}
        user={userData}
        isOwner={isOwner}
        isAdmin={isAdmin}
        hasApplied={hasApplied}
      />
    </div>
  );
}