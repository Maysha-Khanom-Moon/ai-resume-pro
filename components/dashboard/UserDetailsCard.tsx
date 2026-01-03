'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Edit, 
  Facebook, 
  Github, 
  Linkedin 
} from 'lucide-react';

interface UserDetailsCardProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string[];
    education?: string;
    experience?: string;
    currentJob?: string;
    skills?: string[];
    imageLink?: string;
    fbLink?: string;
    githubLink?: string;
    linkedinLink?: string;
    location?: string;
  };
}

export default function UserDetailsCard({ user }: UserDetailsCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden sticky top-24">
      {/* Header with gradient */}
      <div className="h-24 bg-gradient-to-br from-blue-500 to-cyan-500" />
      
      {/* Profile Section */}
      <div className="px-6 pb-6">
        {/* Avatar */}
        <div className="flex justify-center -mt-12 mb-4">
          {user.imageLink ? (
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl">
              <Image
                src={user.imageLink}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-3xl border-4 border-white dark:border-slate-800 shadow-xl">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Name & Email */}
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {user.name}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {user.email}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            {user.role.map((role) => (
              <span
                key={role}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold rounded-full"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        {/* Edit Profile Button */}
        <Link href="/dashboard/profile" className="block mb-6">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </Link>

        {/* Details */}
        <div className="space-y-4 mb-6">
          {user.location && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-0.5">
                  Location
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {user.location}
                </div>
              </div>
            </div>
          )}

          {user.currentJob && (
            <div className="flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-0.5">
                  Current Position
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {user.currentJob}
                </div>
              </div>
            </div>
          )}

          {user.education && (
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-0.5">
                  Education
                </div>
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  {user.education}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="mb-6">
            <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-2">
              Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {user.skills.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 6 && (
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium rounded-lg">
                  +{user.skills.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        {(user.fbLink || user.githubLink || user.linkedinLink) && (
          <div className="pt-6 border-t-2 border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-500 font-medium mb-3">
              Social Links
            </div>
            <div className="flex items-center gap-2">
              {user.linkedinLink && (
                <a
                  href={user.linkedinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {user.githubLink && (
                <a
                  href={user.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {user.fbLink && (
                <a
                  href={user.fbLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}