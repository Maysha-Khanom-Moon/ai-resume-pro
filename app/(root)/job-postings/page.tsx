// app/job-postings/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import JobPostingsList from '@/components/jobs/JobPostingsList';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import Footer from '@/components/Footer';

export default async function JobPostingsPage() {
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  await dbConnect();

  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch jobs posted by this user
  const jobs = await Job.find({ recruiter: user._id })
    .sort({ createdAt: -1 })
    .lean();

  const userData = JSON.parse(JSON.stringify(user));
  const jobsData = JSON.parse(JSON.stringify(jobs));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNavbar user={userData} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            My Job Postings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your job postings and track applications
          </p>
        </div>

        <JobPostingsList jobs={jobsData} userId={userData._id} />
      </main>
      <Footer />
    </div>
  );
}