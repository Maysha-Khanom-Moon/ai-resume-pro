'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeButtons = [
    { value: 'system', icon: Monitor, label: 'System' },
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' }
  ];

  return (
    <footer className="border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 p-2 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
                <Image
                  src="/logo.png"
                  alt="AIResumePro"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                AIResumePro
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              AI-powered resume optimization to help you land your dream job. 
              Trusted by 50,000+ professionals worldwide.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {['Features', 'Pricing', 'Examples', 'Templates'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, '-')}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center md:text-left">
            © {new Date().getFullYear()} AIResumePro. All rights reserved.
          </p>

          {/* Theme Switcher */}
          {mounted && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">Theme:</span>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 shadow-inner">
                {themeButtons.map((btn) => (
                  <button
                    key={btn.value}
                    onClick={() => setTheme(btn.value)}
                    className={`p-2.5 rounded-lg transition-all ${
                      theme === btn.value
                        ? 'bg-linear-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    aria-label={`Switch to ${btn.label} theme`}
                    title={btn.label}
                  >
                    <btn.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Social Links */}
          <div className="flex items-center gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <Link
                key={social}
                href={`https://${social.toLowerCase()}.com`}
                className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {social}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}