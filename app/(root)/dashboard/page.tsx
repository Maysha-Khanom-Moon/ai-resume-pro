// app/(root)/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import UserDetailsCard from '@/components/dashboard/UserDetailsCard';
import ResumesAndApplications from '@/components/dashboard/ResumesAndApplications';
import JobPostings from '@/components/dashboard/JobPostings';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import Footer from '@/components/Footer';

// Define the populated recruiter type
interface PopulatedRecruiter {
  _id: string;
  name: string;
  company?: string;
}

// Define the job type with populated recruiter
interface JobWithPopulatedRecruiter {
  _id: any;
  title: string;
  company: string;
  location: string;
  createdAt: Date;
  recruiter: PopulatedRecruiter;
  applicants: Array<{
    user: any;
    resumeUrl: string;
    appliedAt: Date;
  }>;
}

export default async function DashboardPage() {
  // Check authentication
  const session = await auth();
  
  if (!session || !session.user) {
    redirect('/auth/signin');
  }

  // Connect to database
  await dbConnect();

  // Fetch user data with resumes
  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect('/auth/signin');
  }

  // Get user's resumes from the user document (sorted by most recent)
  const resumes = (user.resumes || [])
    .sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
    .slice(0, 5);

  // Fetch jobs user has applied to (jobs where user._id is in applicants array)
  const appliedJobsRaw = await Job.find({ 
    'applicants.user': user._id 
  })
    .populate('recruiter', 'name company')
    .sort({ createdAt: -1 })
    .limit(5)
    .lean() as unknown as JobWithPopulatedRecruiter[];

  // Transform applied jobs to include appliedAt date
  const appliedJobs = appliedJobsRaw.map(job => {
    // Find the specific application for this user
    const userApplication = job.applicants.find(
      (app: any) => app.user.toString() === session.user.id
    );
    
    return {
      _id: job._id.toString(),
      title: job.title,
      company: job.company,
      location: job.location,
      createdAt: job.createdAt.toISOString(),
      appliedAt: userApplication?.appliedAt?.toISOString() || job.createdAt.toISOString(),
      recruiter: {
        name: job.recruiter.name,
        company: job.recruiter.company
      }
    };
  });

  // Fetch jobs posted by user (if they're a recruiter)
  const postedJobs = await Job.find({ recruiter: user._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Convert mongoose documents to plain objects
  const userData = JSON.parse(JSON.stringify(user));
  const resumesData = JSON.parse(JSON.stringify(resumes));
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
              appliedJobs={appliedJobs}
              userId={userData._id}
            />
          </div>

          {/* Right Column - Posted Jobs */}
          <div className="lg:col-span-3">
            <JobPostings 
              postedJobs={postedJobsData}
              userId={userData._id}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}