// app/jobs/[jobId]/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import JobDetailView from '@/components/jobs/JobDetailView';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import Footer from '@/components/Footer';

interface Props {
  params: Promise<{
    jobId: string;
  }>;
}

export default async function JobDetailPage({ params }: Props) {
  // 1. Unwrapping the params promise
  const { jobId } = await params;

  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  await dbConnect();

  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // 2. Use the unwrapped jobId here
  const job = await Job.findById(jobId)
    .populate('recruiter', 'name email company')
    .populate('applicants', 'name email')
    .lean();

  if (!job) {
    redirect('/jobs');
  }

  const userData = JSON.parse(JSON.stringify(user));
  const jobData = JSON.parse(JSON.stringify(job));

  // Check if user is the owner
  const isOwner = job.recruiter._id.toString() === user._id.toString();
  const isAdmin = user.role.includes('admin');
  const hasApplied = job.applicants.some(
    (applicant: any) => applicant._id.toString() === user._id.toString()
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNavbar user={userData} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobDetailView 
          job={jobData} 
          user={userData}
          isOwner={isOwner}
          isAdmin={isAdmin}
          hasApplied={hasApplied}
        />
      </main>
      <Footer />
    </div>
  );
}