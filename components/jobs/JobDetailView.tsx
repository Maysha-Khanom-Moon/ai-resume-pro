// components/jobs/JobDetailView.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Building2, 
  MapPin, 
  Calendar,
  Users,
  Edit,
  Trash2,
  Save,
  X,
  Loader2,
  ArrowLeft,
  Upload,
  CheckCircle
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
    email: string;
    company?: string;
  };
  applicants: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string[];
}

interface JobDetailViewProps {
  job: Job;
  user: User;
  isOwner: boolean;
  isAdmin: boolean;
  hasApplied: boolean;
}

export default function JobDetailView({ 
  job, 
  user, 
  isOwner, 
  isAdmin,
  hasApplied 
}: JobDetailViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    company: job.company,
    location: job.location
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/jobs/${job._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recruiterId: user._id
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert('Failed to update job posting');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/jobs/${job._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recruiterId: user._id,
          role: isAdmin ? 'admin' : 'recruiter'
        }),
      });

      if (response.ok) {
        router.push('/jobs');
      } else {
        alert('Failed to delete job posting');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);

    try {
      const response = await fetch(`/api/jobs/${job._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('An error occurred');
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Link href="/jobs">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Button>
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-2xl font-bold bg-white/90 dark:bg-slate-800/90 border-2"
                />
              ) : (
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {job.title}
                </h1>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-white/90 mt-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {isEditing ? (
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="bg-white/90 dark:bg-slate-800/90 border-2 max-w-xs"
                    />
                  ) : (
                    <span className="font-medium">{job.company}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="bg-white/90 dark:bg-slate-800/90 border-2 max-w-xs"
                    />
                  ) : (
                    <span className="font-medium">{job.location}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex items-center gap-2">
                {(isOwner || isAdmin) && (
                  <>
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30"
                    >
                      <Edit className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                    <Button
                      onClick={handleDelete}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <Trash2 className="w-4 h-4 md:mr-2" />
                      <span className="hidden md:inline">Delete</span>
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Job Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              Job Description
              {isEditing && (
                <span className="text-sm text-slate-500 dark:text-slate-400 font-normal">
                  (editing mode)
                </span>
              )}
            </h2>
            
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={12}
                  className="text-base border-2 resize-none"
                />
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        title: job.title,
                        description: job.description,
                        company: job.company,
                        location: job.location
                      });
                    }}
                    className="border-2"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>
            )}
          </div>

          {/* Recruiter Info */}
          <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
              Posted By
            </h3>
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {job.recruiter.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {job.recruiter.name}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {job.recruiter.email}
                </div>
              </div>
            </div>
          </div>

          {/* Applicants Section (Owner/Admin only) */}
          {(isOwner || isAdmin) && (
            <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Applicants ({job.applicants.length})
                </h3>
              </div>
              
              {job.applicants.length > 0 ? (
                <div className="space-y-2">
                  {job.applicants.map((applicant) => (
                    <div
                      key={applicant._id}
                      className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                        {applicant.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {applicant.name}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {applicant.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                  No applicants yet
                </p>
              )}
            </div>
          )}

          {/* Apply Section (Non-owner) */}
          {!isOwner && !isAdmin && (
            <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700">
              {hasApplied ? (
                <div className="flex items-center justify-center gap-3 p-6 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <p className="text-green-700 dark:text-green-300 font-semibold">
                    You have already applied to this job
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Apply for this position
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Submit your application to be considered for this role
                  </p>
                  <Button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full md:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Applying...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mr-2" />
                        Apply Now
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}