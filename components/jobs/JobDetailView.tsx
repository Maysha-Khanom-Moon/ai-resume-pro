// components/jobs/JobDetailView.tsx
'use client';

import { useState, useEffect } from 'react';
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
  CheckCircle,
  FileText,
  ExternalLink,
  Star
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
    user: string; // This is the user ID
    name: string;
    email: string;
    resumeUrl?: string;
    appliedAt?: string; // Add this field
  }>;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string[];
}

interface Resume {
  _id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  isDefault?: boolean;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [existingResumes, setExistingResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [resumeOption, setResumeOption] = useState<'existing' | 'upload'>('existing');
  const [formData, setFormData] = useState({
    title: job.title,
    description: job.description,
    company: job.company,
    location: job.location
  });

  // Calculate the user's application date
  const userApplication = job.applicants.find(
    (applicant) => applicant.user?.toString() === user._id
  );
  const applicationDate = userApplication?.appliedAt;

  // Fetch user's existing resumes
  useEffect(() => {
    if (!isOwner && !isAdmin) {
      fetchExistingResumes();
    }
  }, [isOwner, isAdmin]);

  const fetchExistingResumes = async () => {
    setLoadingResumes(true);
    try {
      const response = await fetch(`/api/users/${user._id}/resumes`);
      if (response.ok) {
        const data = await response.json();
        setExistingResumes(data.resumes || []);
        
        // Auto-select default resume if exists
        const defaultResume = data.resumes?.find((r: Resume) => r.isDefault);
        if (defaultResume) {
          setSelectedResumeId(defaultResume._id);
        }
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
    }
  };

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
    let resumeUrl = '';

    console.log('=== APPLY PROCESS STARTED ===');
    console.log('User ID:', user._id);
    console.log('Job ID:', job._id);
    console.log('Resume Option:', resumeOption);
    console.log('Selected Resume ID:', selectedResumeId);
    console.log('Selected File:', selectedFile?.name);

    // Validate based on selected option
    if (resumeOption === 'existing') {
      if (!selectedResumeId) {
        alert('Please select a resume from your saved resumes');
        return;
      }
      const selectedResume = existingResumes.find(r => r._id === selectedResumeId);
      if (selectedResume) {
        resumeUrl = selectedResume.url;
        console.log('Using existing resume URL:', resumeUrl);
      } else {
        alert('Selected resume not found');
        return;
      }
    } else {
      if (!selectedFile) {
        alert('Please upload your resume (PDF)');
        return;
      }
    }

    setApplying(true);

    try {
      // If uploading new file
      if (resumeOption === 'upload' && selectedFile) {
        setUploadProgress('Uploading resume...');
        console.log('Uploading new resume...');
        
        const formData = new FormData();
        formData.append('file', selectedFile);

        const uploadResponse = await fetch('/api/upload/resume', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          console.error('Upload failed:', errorData);
          throw new Error(errorData.error || 'Failed to upload resume');
        }

        const { url } = await uploadResponse.json();
        resumeUrl = url;
        console.log('Resume uploaded:', resumeUrl);

        // Save to user's resumes
        setUploadProgress('Saving resume to your profile...');
        console.log('Saving resume to user profile...');
        
        const saveResponse = await fetch(`/api/users/${user._id}/resumes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: resumeUrl,
            filename: selectedFile.name,
            isDefault: existingResumes.length === 0
          }),
        });

        if (!saveResponse.ok) {
          console.error('Failed to save resume to profile');
        } else {
          console.log('Resume saved to profile');
        }
      }

      // Final validation
      if (!resumeUrl) {
        console.error('No resume URL available');
        alert('Resume URL is missing. Please try again.');
        return;
      }

      setUploadProgress('Submitting application...');
      console.log('Submitting application with:', { userId: user._id, resumeUrl });

      // Submit application
      const response = await fetch(`/api/jobs/${job._id}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          resumeUrl
        }),
      });

      const responseData = await response.json();
      console.log('Apply response:', { status: response.status, data: responseData });

      if (response.ok) {
        console.log('✅ Application submitted successfully');
        setUploadProgress('');
        alert('Application submitted successfully!');
        router.refresh();
      } else {
        console.error('❌ Application failed:', responseData);
        alert(responseData.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('❌ Error applying:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while submitting your application');
    } finally {
      setApplying(false);
      setUploadProgress('');
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
                  <span>
                    {hasApplied && applicationDate 
                      ? `Applied ${formatDistanceToNow(new Date(applicationDate), { addSuffix: true })}`
                      : `Posted ${formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}`
                    }
                  </span>
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
                        {applicant.appliedAt && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Applied {formatDistanceToNow(new Date(applicant.appliedAt), { addSuffix: true })}
                          </div>
                        )}
                      </div>
                      {applicant.resumeUrl && (
                        <a
                          href={applicant.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span className="text-sm font-medium">View Resume</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
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
                    {applicationDate && (
                      <span className="block text-sm mt-1">
                        Applied {formatDistanceToNow(new Date(applicationDate), { addSuffix: true })}
                      </span>
                    )}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Apply for this position
                  </h3>

                  {/* Resume Option Selector */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => setResumeOption('existing')}
                      className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                        resumeOption === 'existing'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Use Saved Resume</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {existingResumes.length} resume{existingResumes.length !== 1 ? 's' : ''} available
                          </div>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => setResumeOption('upload')}
                      className={`flex-1 p-4 border-2 rounded-xl transition-all ${
                        resumeOption === 'upload'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5" />
                        <div className="text-left">
                          <div className="font-semibold">Upload New</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            Upload a new resume
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Existing Resumes Selection */}
                  {resumeOption === 'existing' && (
                    <div className="space-y-3">
                      {loadingResumes ? (
                        <div className="text-center py-8">
                          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            Loading your resumes...
                          </p>
                        </div>
                      ) : existingResumes.length > 0 ? (
                        <div className="space-y-2">
                          {existingResumes.map((resume) => (
                            <label
                              key={resume._id}
                              className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                                selectedResumeId === resume._id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                  : 'border-slate-300 dark:border-slate-600 hover:border-blue-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name="resume"
                                value={resume._id}
                                checked={selectedResumeId === resume._id}
                                onChange={(e) => setSelectedResumeId(e.target.value)}
                                className="w-4 h-4"
                              />
                              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-slate-900 dark:text-white">
                                    {resume.filename}
                                  </span>
                                  {resume.isDefault && (
                                    <span className="flex items-center gap-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded">
                                      <Star className="w-3 h-3" />
                                      Default
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400">
                                  Uploaded {formatDistanceToNow(new Date(resume.uploadedAt), { addSuffix: true })}
                                </div>
                              </div>
                              <a
                                href={resume.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                              >
                                Preview
                              </a>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl">
                          <FileText className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                          <p className="text-slate-600 dark:text-slate-400 mb-2">
                            No saved resumes found
                          </p>
                          <button
                            onClick={() => setResumeOption('upload')}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            Upload a new resume instead
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* File Upload */}
                  {resumeOption === 'upload' && (
                    <div className="space-y-3">
                      <label className="block">
                        <div className="flex items-center justify-center w-full p-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-800/50">
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="text-center">
                            <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                            {selectedFile ? (
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            ) : (
                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  Click to upload resume
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                  PDF only, max 5MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </label>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        This resume will be saved to your profile for future applications
                      </p>
                    </div>
                  )}

                  {uploadProgress && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 text-center">
                      {uploadProgress}
                    </p>
                  )}

                  <Button
                    onClick={handleApply}
                    disabled={applying || (resumeOption === 'existing' && !selectedResumeId) || (resumeOption === 'upload' && !selectedFile)}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applying ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Submit Application
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