// components/dashboard/ResumesAndApplications.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Briefcase, 
  ExternalLink, 
  Trash2, 
  Star,
  Upload,
  Loader2,
  Calendar,
  Building2,
  MapPin
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface Resume {
  _id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  isDefault?: boolean;
}

interface AppliedJob {
  _id: string;
  title: string;
  company: string;
  location: string;
  createdAt: string;
  appliedAt: string; // Changed from optional to required since we'll always have it
  recruiter: {
    name: string;
    company?: string;
  };
}

interface ResumesAndApplicationsProps {
  resumes: Resume[];
  appliedJobs: AppliedJob[];
  userId: string;
}

export default function ResumesAndApplications({
  resumes: initialResumes,
  appliedJobs,
  userId
}: ResumesAndApplicationsProps) {
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>(initialResumes);
  const [activeTab, setActiveTab] = useState<'resumes' | 'applications'>('resumes');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [deletingResumeId, setDeletingResumeId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadingResume(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload/resume', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload resume');
      }

      const { url } = await uploadResponse.json();

      const saveResponse = await fetch(`/api/users/${userId}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          filename: file.name,
          isDefault: resumes.length === 0
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save resume');
      }

      const { resumes: updatedResumes } = await saveResponse.json();
      setResumes(updatedResumes);
      router.refresh();
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Failed to upload resume');
    } finally {
      setUploadingResume(false);
      e.target.value = '';
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    setDeletingResumeId(resumeId);

    try {
      const response = await fetch(
        `/api/users/${userId}/resumes?resumeId=${resumeId}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete resume');
      }

      const { resumes: updatedResumes } = await response.json();
      setResumes(updatedResumes);
      router.refresh();
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Failed to delete resume');
    } finally {
      setDeletingResumeId(null);
    }
  };

  const handleSetDefault = async (resumeId: string) => {
    setSettingDefaultId(resumeId);

    try {
      const response = await fetch(`/api/users/${userId}/resumes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeId }),
      });

      if (!response.ok) {
        throw new Error('Failed to set default resume');
      }

      const { resumes: updatedResumes } = await response.json();
      setResumes(updatedResumes);
      router.refresh();
    } catch (error) {
      console.error('Error setting default resume:', error);
      alert('Failed to set default resume');
    } finally {
      setSettingDefaultId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('resumes')}
          className={`flex-1 px-6 py-4 font-semibold transition-all ${
            activeTab === 'resumes'
              ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <FileText className="w-5 h-5" />
            <span>Resumes ({resumes.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`flex-1 px-6 py-4 font-semibold transition-all ${
            activeTab === 'applications'
              ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <Briefcase className="w-5 h-5" />
            <span>Applications ({appliedJobs.length})</span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'resumes' ? (
          <div className="space-y-4">
            {/* Upload Button */}
            <label className="block">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploadingResume}
                className="hidden"
              />
              <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer bg-slate-50 dark:bg-slate-900/50">
                {uploadingResume ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <span className="font-medium text-slate-900 dark:text-white">
                      Upload New Resume
                    </span>
                  </>
                )}
              </div>
            </label>

            {/* Resume List */}
            {resumes.length > 0 ? (
              <div className="space-y-3">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                  >
                    <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                          {resume.filename}
                        </h4>
                        {resume.isDefault && (
                          <span className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded-full flex-shrink-0">
                            <Star className="w-3 h-3 fill-current" />
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Uploaded {formatDistanceToNow(new Date(resume.uploadedAt), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!resume.isDefault && (
                        <Button
                          onClick={() => handleSetDefault(resume._id)}
                          disabled={settingDefaultId === resume._id}
                          size="sm"
                          variant="outline"
                          className="border-2"
                        >
                          {settingDefaultId === resume._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      <a
                      
                        href={resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
                      >
                        View
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      
                      <Button
                        onClick={() => handleDeleteResume(resume._id)}
                        disabled={deletingResumeId === resume._id}
                        size="sm"
                        variant="outline"
                        className="border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        {deletingResumeId === resume._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No resumes yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Upload your first resume to start applying for jobs
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {appliedJobs.length > 0 ? (
              <div className="space-y-3">
                {appliedJobs.map((job) => (
                  <Link
                    key={job._id}
                    href={`/jobs/${job._id}`}
                    className="block p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {job.company.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1 truncate">
                          {job.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 mt-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Applied {formatDistanceToNow(new Date(job.appliedAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Briefcase className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No applications yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Start applying to jobs to see them here
                </p>
                <Link href="/jobs">
                  <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}