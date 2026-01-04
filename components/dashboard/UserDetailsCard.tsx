// components/dashboard/UserDetailsCard.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Briefcase,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string[];
  bio?: string;
  location?: string;
  currentJob?: string;
  skills?: string[];
  imageLink?: string;
}

interface UserDetailsCardProps {
  user: User;
}

export default function UserDetailsCard({ user }: UserDetailsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    bio: user.bio || '',
    location: user.location || '',
    currentJob: user.currentJob || '',
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/users/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsEditing(false);
        window.location.reload();
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-center">
        {user.imageLink ? (
          <img
            src={user.imageLink}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto border-4 border-white dark:border-slate-800 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full mx-auto border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {getInitials(user.name)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Bio
              </label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={3}
                className="border-2 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Location
              </label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="border-2"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Current Job
              </label>
              <Input
                value={formData.currentJob}
                onChange={(e) => setFormData({ ...formData, currentJob: e.target.value })}
                className="border-2"
                placeholder="Your current position"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name,
                    bio: user.bio || '',
                    location: user.location || '',
                    currentJob: user.currentJob || '',
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
          <>
            <div className="text-center border-b-2 border-slate-200 dark:border-slate-700 pb-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {user.name}
              </h2>
              <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400 mb-2">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              {user.role.includes('recruiter') && (
                <span className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
                  Recruiter
                </span>
              )}
            </div>

            <div className="space-y-3">
              {user.currentJob && (
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Current Position
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.currentJob}
                    </p>
                  </div>
                </div>
              )}

              {user.location && (
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Location
                    </p>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {user.location}
                    </p>
                  </div>
                </div>
              )}

              {user.bio && (
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                      About
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {user.bio}
                    </p>
                  </div>
                </div>
              )}

              {user.skills && user.skills.length > 0 && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 space-y-2">
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>

              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full border-2">
                  View Full Profile
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}