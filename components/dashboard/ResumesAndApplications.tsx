'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Plus, 
  Eye, 
  Download, 
  Trash2,
  Briefcase,
  MapPin,
  Clock,
  Building2,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Resume {
  _id: string;
  title: string;
  filePath: string;
  visibility: 'public' | 'private';
  skills: string[];
  createdAt: string;
}

interface AppliedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  recruiter: {
    name: string;
    company?: string;
  };
  createdAt: string;
}

interface ResumesAndApplicationsProps {
  resumes: Resume[];
  appliedJobs: AppliedJob[];
  userId: string;
}

export default function ResumesAndApplications({ 
  resumes, 
  appliedJobs,
  userId 
}: ResumesAndApplicationsProps) {
  return (
    <div className="space-y-6">
      {/* Resumes Section */}
      <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                My Resumes
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} uploaded
              </p>
            </div>
          </div>
          <Link href="/dashboard/resumes/upload">
            <Button className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </Link>
        </div>

        {resumes.length > 0 ? (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume._id}
                className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">
                        {resume.title}
                      </h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        resume.visibility === 'public'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {resume.visibility}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(resume.createdAt), { addSuffix: true })}
                      </span>
                      {resume.skills.length > 0 && (
                        <span>{resume.skills.length} skills</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              No resumes uploaded yet
            </p>
            <Link href="/dashboard/resumes/upload">
              <Button className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Resume
              </Button>
            </Link>
          </div>
        )}

        {resumes.length > 0 && (
          <Link href="/dashboard/resumes" className="block mt-4">
            <Button variant="ghost" className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
              View All Resumes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>

      {/* Applied Jobs Section */}
      <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Briefcase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Applied Jobs
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {appliedJobs.length} application{appliedJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Link href="/dashboard/jobs">
            <Button variant="outline" className="border-2">
              Browse Jobs
            </Button>
          </Link>
        </div>

        {appliedJobs.length > 0 ? (
          <div className="space-y-3">
            {appliedJobs.map((job) => (
              <Link
                key={job._id}
                href={`/dashboard/jobs/${job._id}`}
                className="block p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {job.title}
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Building2 className="w-4 h-4" />
                        <span>{job.company || job.recruiter.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>
                          Applied {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              You haven't applied to any jobs yet
            </p>
            <Link href="/dashboard/jobs">
              <Button className="bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                Browse Available Jobs
              </Button>
            </Link>
          </div>
        )}

        {appliedJobs.length > 0 && (
          <Link href="/dashboard/applications" className="block mt-4">
            <Button variant="ghost" className="w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950">
              View All Applications
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}