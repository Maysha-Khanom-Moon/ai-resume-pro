'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Shield, 
  Menu, 
  X,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { signOut } from 'next-auth/react';

interface DashboardNavbarProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string[];
    imageLink?: string;
  };
}

export default function DashboardNavbar({ user }: DashboardNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = user.role.includes('admin');

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Jobs', href: '/dashboard/jobs', icon: Briefcase },
    { name: 'Resume Checker', href: '/dashboard/resume-checker', icon: FileText },
    ...(isAdmin ? [{ name: 'Admin Panel', href: '/admin', icon: Shield }] : [])
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur supports-backdrop-filter:bg-white/60 dark:supports-backdrop-filter:bg-slate-900/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 p-2 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="AIResumePro"
                fill
                className="object-contain p-1"
              />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AIResumePro
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard/profile">
              <Button variant="ghost" className="flex items-center gap-2">
                {user.imageLink ? (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={user.imageLink}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{user.name}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 py-6 space-y-1">
            {/* User Info */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg mb-4">
              {user.imageLink ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.imageLink}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">{user.email}</div>
              </div>
            </div>

            {/* Navigation Links */}
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 rounded-lg transition-all"
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Logout */}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}