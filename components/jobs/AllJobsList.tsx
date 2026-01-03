// components/jobs/AllJobsList.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Briefcase, 
  Building2, 
  MapPin, 
  Calendar,
  Users
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  recruiter: {
    _id: string;
    name: string;
    company?: string;
  };
  applicants: string[];
  createdAt: string;
}

interface AllJobsListProps {
  jobs: Job[];
  userId: string;
}

export default function AllJobsList({ jobs, userId }: AllJobsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter jobs based on search
  const filteredJobs = useMemo(() => {
    if (!searchTerm.trim()) return jobs;

    const search = searchTerm.toLowerCase();
    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.location.toLowerCase().includes(search)
    );
  }, [jobs, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-lg">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs by title, company, location..."
            className="pl-12 pr-4 py-6 text-base border-2"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-slate-600 dark:text-slate-400">
          Showing <span className="font-semibold text-slate-900 dark:text-white">{filteredJobs.length}</span> job{filteredJobs.length !== 1 ? 's' : ''}
        </p>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid gap-4 md:gap-6">
          {filteredJobs.map((job) => (
            <Link
              key={job._id}
              href={`/jobs/${job._id}`}
              className="block bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Left Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {job.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-500">
                    <span>Posted by</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {job.recruiter.name}
                    </span>
                  </div>
                </div>

                {/* Right Content - Applicants */}
                <div className="flex items-center gap-3 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 rounded-xl">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      {job.applicants.length}
                    </span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    applicant{job.applicants.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
          <Search className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            No jobs found
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {searchTerm
              ? `No jobs match "${searchTerm}". Try a different search term.`
              : 'There are no job postings available at the moment.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Clear search and view all jobs
            </button>
          )}
        </div>
      )}
    </div>
  );
}