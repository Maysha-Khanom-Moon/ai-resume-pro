// components/resume/ResumeCheckerView.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Target,
  Lightbulb,
  Award,
  BarChart3,
  Star,
  ExternalLink,
} from 'lucide-react';

interface Resume {
  _id: string;
  url: string;
  filename: string;
  uploadedAt: string;
  isDefault?: boolean;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Analysis {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  matchingSkills: string[];
  skillGaps: string[];
  experienceMatch: string;
  overallAssessment: string;
  resumeUrl?: string;
  analyzedAt?: string;
  jobDetails?: {
    title: string;
    company: string;
    location: string;
  };
}

interface ResumeCheckerViewProps {
  user: User;
  resumes: Resume[];
  jobId?: string;
}

export default function ResumeCheckerView({ user, resumes, jobId }: ResumeCheckerViewProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeOption, setResumeOption] = useState<'existing' | 'upload' | 'url'>('existing');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState('');

  // Auto-select default resume
  useEffect(() => {
    const defaultResume = resumes.find(r => r.isDefault);
    if (defaultResume && !selectedResumeId) {
      setSelectedResumeId(defaultResume._id);
    }
  }, [resumes]);

  // Fetch job description if jobId is provided
  useEffect(() => {
    if (jobId) {
      fetchJobDescription(jobId);
    }
  }, [jobId]);

  const fetchJobDescription = async (id: string) => {
    try {
      const response = await fetch(`/api/jobs/${id}`);
      if (response.ok) {
        const job = await response.json();
        setJobDescription(`${job.title}\n\n${job.description}\n\nCompany: ${job.company}\nLocation: ${job.location}`);
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description');
      return;
    }

    let resumeData: any = {};

    // Validate resume selection
    if (resumeOption === 'existing') {
      if (!selectedResumeId) {
        setError('Please select a resume');
        return;
      }
      const selectedResume = resumes.find(r => r._id === selectedResumeId);
      if (!selectedResume) {
        setError('Selected resume not found');
        return;
      }
      resumeData.resumeUrl = selectedResume.url;
    } else if (resumeOption === 'upload') {
      if (!selectedFile) {
        setError('Please upload a resume');
        return;
      }
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(selectedFile);
      });
      resumeData.resumeFile = await base64Promise;
    } else if (resumeOption === 'url') {
      if (!resumeUrl.trim()) {
        setError('Please provide a resume URL');
        return;
      }
      resumeData.resumeUrl = resumeUrl;
    }

    setAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resumeData,
          jobDescription,
          jobId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze resume');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            AI Resume Checker
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Get AI-powered feedback on how well your resume matches a job description
          </p>
        </div>

        {!analysis ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Input */}
            <div className="space-y-6">
              {/* Job Description */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Job Description
                </h2>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  rows={12}
                  className="border-2 resize-none"
                />
              </div>
            </div>

            {/* Right Column - Resume Selection */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Select Resume
                </h2>

                {/* Resume Options */}
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => setResumeOption('existing')}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      resumeOption === 'existing'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Use Saved Resume</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          {resumes.length} resume{resumes.length !== 1 ? 's' : ''} available
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setResumeOption('upload')}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      resumeOption === 'upload'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Upload className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Upload New Resume</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          PDF only, max 5MB
                        </div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setResumeOption('url')}
                    className={`w-full p-4 border-2 rounded-xl transition-all text-left ${
                      resumeOption === 'url'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ExternalLink className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">Use Resume URL</div>
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                          Provide a link to your resume
                        </div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Resume Input Based on Selection */}
                {resumeOption === 'existing' && resumes.length > 0 && (
                  <div className="space-y-2">
                    {resumes.map((resume) => (
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
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {resumeOption === 'upload' && (
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
                )}

                {resumeOption === 'url' && (
                  <Input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://example.com/resume.pdf"
                    className="border-2"
                  />
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Resume...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-5 h-5 mr-2" />
                      Analyze Resume
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* Analysis Results */
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Analysis Results
                  </h2>
                  {analysis.jobDetails && (
                    <p className="text-slate-600 dark:text-slate-400">
                      {analysis.jobDetails.title} at {analysis.jobDetails.company}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => {
                    setAnalysis(null);
                    setError('');
                  }}
                  variant="outline"
                  className="border-2"
                >
                  New Analysis
                </Button>
              </div>

              <div className="flex items-center justify-center mb-8">
                <div className={`relative w-40 h-40 rounded-full ${getScoreBgColor(analysis.score)} flex items-center justify-center`}>
                  <div className="text-center">
                    <div className={`text-5xl font-bold ${getScoreColor(analysis.score)}`}>
                      {analysis.score}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      out of 100
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-lg text-slate-700 dark:text-slate-300 text-center mb-4">
                {analysis.summary}
              </p>
            </div>

            {/* Strengths */}
            {analysis.strengths.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Strengths
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Weaknesses */}
            {analysis.weaknesses.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Areas for Improvement
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-slate-300">{weakness}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suggestions */}
            {analysis.suggestions.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Recommendations
                  </h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-slate-700 dark:text-slate-300">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Analysis */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Matching Skills */}
              {analysis.matchingSkills.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Matching Skills
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.matchingSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Gaps */}
              {analysis.skillGaps.length > 0 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Skill Gaps
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.skillGaps.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Missing Keywords */}
            {analysis.missingKeywords.length > 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Missing Keywords
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Consider incorporating these keywords from the job description:
                </p>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Overall Assessment */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Overall Assessment
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {analysis.overallAssessment}
              </p>
            </div>

            {/* Experience Match */}
            {analysis.experienceMatch && (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Experience Alignment
                </h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysis.experienceMatch}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}