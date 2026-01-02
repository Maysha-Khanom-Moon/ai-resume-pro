// components/Hero.tsx

'use client'

import { Button } from "@/components/ui/button"; // Reuse button component

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-teal-500 to-blue-500 text-white text-center py-20">
      {/* AI-Powered Tag */}
      <div className="inline-block bg-gray-800 text-teal-300 text-sm font-semibold py-2 px-4 rounded-full mb-6">
        AI-Powered Resume Matching
      </div>

      {/* Main Header */}
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
        Land Your Dream Job <span className="text-teal-400">Faster</span>
      </h1>

      {/* Subheader */}
      <p className="text-lg md:text-xl mb-8">
        Get AI-powered fit scores, identify skill gaps, and receive actionable suggestions to make your resume stand out for any job.
      </p>

      {/* Action Buttons */}
      <div className="flex justify-center gap-6">
        <Button className="bg-teal-600 hover:bg-teal-700 text-white py-3 px-8 rounded-lg text-xl">
          Get Started Free
        </Button>
        <Button className="bg-transparent border-2 border-white hover:bg-teal-600 text-white py-3 px-8 rounded-lg text-xl">
          I'm a Recruiter
        </Button>
      </div>
    </section>
  );
};

export default Hero;
