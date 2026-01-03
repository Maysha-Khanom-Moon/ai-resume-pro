import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import UserDetailsCard from '@/components/dashboard/UserDetailsCard';
import ResumesAndApplications from '@/components/dashboard/ResumesAndApplications';
import JobPostings from '@/components/dashboard/JobPostings';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Resume } from '@/models/Resume';
import { Job } from '@/models/Job';
import Footer from '@/components/Footer';

export default async function DashboardPage() {
  // Check authentication
  const session = await auth();
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // Connect to database
  await dbConnect();

  // Fetch user data
  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Fetch user's resumes
  const resumes = await Resume.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Fetch jobs user has applied to (jobs where user is in applicants array)
  const appliedJobs = await Job.find({ applicants: user._id })
    .populate('recruiter', 'name company')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Fetch jobs posted by user (if they're a recruiter)
  const postedJobs = await Job.find({ recruiter: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Convert mongoose documents to plain objects
  const userData = JSON.parse(JSON.stringify(user));
  const resumesData = JSON.parse(JSON.stringify(resumes));
  const appliedJobsData = JSON.parse(JSON.stringify(appliedJobs));
  const postedJobsData = JSON.parse(JSON.stringify(postedJobs));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNavbar user={userData} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Welcome back, {userData.name}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Here's what's happening with your job search
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - User Details */}
          <div className="lg:col-span-3">
            <UserDetailsCard user={userData} />
          </div>

          {/* Middle Column - Resumes & Applied Jobs */}
          <div className="lg:col-span-6">
            <ResumesAndApplications 
              resumes={resumesData} 
              appliedJobs={appliedJobsData}
              userId={userData._id}
            />
          </div>

          {/* Right Column - Posted Jobs */}
          <div className="lg:col-span-3">
            <JobPostings 
              postedJobs={postedJobsData}
              userId={userData._id}
              isRecruiter={userData.role.includes('recruiter') || userData.role.includes('admin')}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}