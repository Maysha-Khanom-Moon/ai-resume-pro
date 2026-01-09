// app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';  // Reusing DashboardNavbar
import Footer from '@/components/Footer';
import dbConnect from '@/lib/db';
import { User } from '@/models/User';
import { Job } from '@/models/Job';
import UserList from '@/components/admin/UserList'; // Custom component for User List
import JobList from '@/components/admin/JobList';   // Custom component for Job List

// app/admin/dashboard/page.tsx

export default async function AdminPanelPage() {
  const session = await auth();
  
  if (!session || !session.user || !session.user.role?.includes('admin')) {
    redirect('/auth/signin');
  }

  // Connect to the database
  await dbConnect();

  // Fetch all users and jobs
  const users = await User.find().select('-password').lean();
  const jobs = await Job.find().populate('recruiter', 'name company').lean();

  // Check if users exist and convert to plain objects
  const usersData = users && users.length ? JSON.parse(JSON.stringify(users)) : [];

  // Check if jobs exist and convert to plain objects
  const jobsData = jobs && jobs.length ? JSON.parse(JSON.stringify(jobs)) : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNavbar user={{ 
        _id: session.user.id, 
        name: session.user.name || '', 
        email: session.user.email, 
        role: session.user.role || [], 
        imageLink: session.user.image 
      }} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Admin Panel
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Manage users and job posts from here.
          </p>
        </div>

        {/* Admin Panel Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Users List */}
          <div className="lg:col-span-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Users</h2>
            <UserList users={usersData} />
          </div>

          {/* Right Column - Jobs List */}
          <div className="lg:col-span-6">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">Job Posts</h2>
            <JobList jobs={jobsData} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
