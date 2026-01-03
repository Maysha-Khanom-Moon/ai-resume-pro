// components/jobs/JobPostingsList.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Briefcase, 
  Plus, 
  X, 
  Users, 
  MapPin, 
  Building2,
  Calendar,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  applicants: string[];
  createdAt: string;
}

interface JobPostingsListProps {
  jobs: Job[];
  userId: string;
}

export default function JobPostingsList({ jobs, userId }: JobPostingsListProps) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    company: '',
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recruiterId: userId
        }),
      });

      if (response.ok) {
        setFormData({ title: '', description: '', company: '', location: '' });
        setShowForm(false);
        router.refresh();
      } else {
        alert('Failed to create job posting');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Jobs List */}
      <div className="grid gap-4 md:gap-6">
        {jobs.map((job) => (
          <Link
            key={job._id}
            href={`/jobs/${job._id}`}
            className="block bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Left Content */}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {job.title}
                </h3>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
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
              </div>

              {/* Right Content - Applicants */}
              <div className="flex items-center gap-3 md:flex-col md:items-end">
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

        {jobs.length === 0 && !showForm && (
          <div className="bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
            <Briefcase className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No job postings yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Create your first job posting to start receiving applications
            </p>
          </div>
        )}
      </div>

      {/* Add New Job Button / Form */}
      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg text-lg py-6 px-8"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Job
        </Button>
      ) : (
        <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Create New Job Posting
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowForm(false)}
              className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Job Title *
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className="text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Company Name *
              </label>
              <Input
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Tech Company Inc."
                className="text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Location *
              </label>
              <Input
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. New York, NY or Remote"
                className="text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Job Description *
              </label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role, responsibilities, requirements, and benefits..."
                rows={8}
                className="text-base resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Create Job Posting
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
                className="flex-1 sm:flex-none border-2 py-6 text-base"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}