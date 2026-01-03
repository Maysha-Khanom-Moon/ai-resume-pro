'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Plus, 
  Users, 
  MapPin,
  Clock,
  Eye,
  Edit,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  applicants: string[];
  createdAt: string;
}

interface JobPostingsProps {
  postedJobs: Job[];
  userId: string;
  isRecruiter: boolean;
}

export default function JobPostings({ postedJobs, userId, isRecruiter }: JobPostingsProps) {
  if (!isRecruiter) {
    return (
      <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
        <div className="text-center py-8">
          <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
            Become a Recruiter
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Post jobs and find the perfect candidates for your company
          </p>
          <Link href="/dashboard/recruiter/apply">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
              Apply as Recruiter
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-lg sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              My Job Posts
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {postedJobs.length} active post{postedJobs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <Link href="/dashboard/jobs/post" className="block mb-6">
        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </Link>

      {postedJobs.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {postedJobs.map((job) => (
            <div
              key={job._id}
              className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md transition-all group"
            >
              <div className="mb-3">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                  {job.title}
                </h3>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <MapPin className="w-3 h-3" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applicants */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {job.applicants.length}
                  </span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    applicant{job.applicants.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/dashboard/jobs/${job._id}`}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`/dashboard/jobs/${job._id}/edit`}>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            No jobs posted yet
          </p>
          <Link href="/dashboard/jobs/post">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm">
              <Plus className="w-4 h-4 mr-2" />
              Post Your First Job
            </Button>
          </Link>
        </div>
      )}

      {postedJobs.length > 0 && (
        <Link href="/dashboard/my-jobs" className="block mt-4">
          <Button variant="ghost" className="w-full text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950 text-sm">
            Manage All Jobs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      )}
    </div>
  );
}