// components/admin/JobList.tsx
'use client'
import React from 'react';

interface Recruiter {
  name: string;
  company: string;
}

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  recruiter: Recruiter;
}

interface JobListProps {
  jobs: Job[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const deleteJob = async (jobId: string) => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Optionally, you can refresh the page or remove the job from state
        alert('Job post deleted successfully');
        location.reload(); // Reload the page to reflect changes
      } else {
        alert('Error deleting job post');
      }
    } catch (error) {
      console.error("Error deleting job post:", error);
      alert('Error deleting job post');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Company</th>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Recruiter</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id}>
              <td className="px-4 py-2">{job.title}</td>
              <td className="px-4 py-2">{job.company}</td>
              <td className="px-4 py-2">{job.location}</td>
              <td className="px-4 py-2">{job.recruiter?.name || 'N/A'}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => deleteJob(job._id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobList;
