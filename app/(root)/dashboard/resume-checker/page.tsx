// app/dashboard/resume-checker/page.tsx
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ResumeCheckerView from '@/components/resume/ResumeCheckerView';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

interface ResumeCheckerPageProps {
  searchParams: Promise<{ jobId?: string }>;
}

export default async function ResumeCheckerPage({ searchParams }: ResumeCheckerPageProps) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/resume-checker');
  }

  await connectDB();
  
  const user = await User.findById(session.user.id).lean();
  
  if (!user) {
    redirect('/auth/signin');
  }

  const { jobId } = await searchParams;

  // Get user's resumes
  const resumes = (user.resumes || []).map((resume: any) => ({
    _id: resume._id.toString(),
    url: resume.url,
    filename: resume.filename,
    uploadedAt: resume.uploadedAt.toISOString(),
    isDefault: resume.isDefault,
  }));

  const userData = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="pt-20 pb-12">
        <ResumeCheckerView 
          user={userData} 
          resumes={resumes}
          jobId={jobId}
        />
      </main>
      <Footer />
    </div>
  );
}