// components/SignUpPage.tsx

'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button"; // Reuse your button component
import Link from 'next/link';

const SignUpPage = () => {
  const [accountType, setAccountType] = useState('job-seeker');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
  };

  return (
    <div className="bg-dark min-h-screen flex justify-center items-center">
      <div className="bg-black text-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <div className="flex justify-between mb-6">
          <Link href="/" className="text-teal-500 hover:text-teal-400">
            &larr; Back to Home
          </Link>
          <div className="text-lg font-semibold">ResumeAI</div>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Create your account</h2>
        <p className="text-lg mb-6">Start your journey to landing your dream job</p>

        {/* Account Type Selection */}
        <div className="flex justify-around mb-6">
          <div
            onClick={() => setAccountType('job-seeker')}
            className={`w-32 py-2 cursor-pointer text-center rounded-lg ${accountType === 'job-seeker' ? 'bg-teal-500' : 'bg-gray-700'}`}
          >
            Job Seeker
          </div>
          <div
            onClick={() => setAccountType('recruiter')}
            className={`w-32 py-2 cursor-pointer text-center rounded-lg ${accountType === 'recruiter' ? 'bg-teal-500' : 'bg-gray-700'}`}
          >
            Recruiter
          </div>
        </div>

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
          
          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />
          
          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white"
            required
          />

          {/* Create Account Button */}
          <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white py-2 rounded-lg">
            Create Account
          </Button>

          {/* Or Continue With Google */}
          <div className="flex items-center justify-center my-4">
            <span className="text-gray-500">OR CONTINUE WITH</span>
          </div>

          {/* Google Sign-In Button */}
          <Button className="w-full bg-white text-black py-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            Continue with Google
          </Button>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Already have an account? <Link href="/signin" className="text-teal-500 hover:text-teal-400">Sign In</Link></p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-4 text-gray-500 text-xs">
          <p>Your data is encrypted and secure</p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
