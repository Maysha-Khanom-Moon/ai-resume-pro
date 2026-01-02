// components/FindCandidates.tsx

'use client'

import CircularProgressBar from './CircularProgressBar'; // Import the custom progress bar component
import { Button } from "@/components/ui/button";

const FindCandidates = () => {
  return (
    <section className="bg-dark text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Title & Subtitle */}
        <h2 className="text-3xl font-semibold mb-6">
          Find the <span className="text-teal-500">Best Candidates</span> Faster
        </h2>
        <p className="text-lg text-gray-300 mb-10">
          Post jobs, receive applications with AI-ranked fit scores, and quickly identify top candidates with skill breakdowns.
        </p>

        {/* Feature List */}
        <div className="text-left max-w-3xl mx-auto mb-10">
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <span className="text-teal-500">✔️</span>
              <span>AI-powered candidate ranking</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-teal-500">✔️</span>
              <span>Skill gap analysis at a glance</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-teal-500">✔️</span>
              <span>Streamlined application review</span>
            </li>
            <li className="flex items-center space-x-3">
              <span className="text-teal-500">✔️</span>
              <span>Privacy-respecting resume access</span>
            </li>
          </ul>
        </div>

        {/* Start Hiring Button */}
        <div className="mb-12">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-8 rounded-lg text-xl">
            Start Hiring →
          </Button>
        </div>

        {/* Candidate Rankings */}
        <div className="space-y-6">
          {/* Candidate 1 */}
          <div className="bg-black p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-teal-500">1. Sarah Chen</h3>
              <div className="text-gray-300 mb-2">
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full mr-2">React</span>
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full mr-2">TypeScript</span>
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full">AWS</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-teal-500">92</div>
              <div className="w-12 h-12">
                <CircularProgressBar progress={92} size={48} strokeWidth={6} />
              </div>
            </div>
          </div>

          {/* Candidate 2 */}
          <div className="bg-black p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-teal-500">2. Michael Ross</h3>
              <div className="text-gray-300 mb-2">
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full mr-2">React</span>
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full mr-2">Node.js</span>
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full">Docker</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-teal-500">85</div>
              <div className="w-12 h-12">
                <CircularProgressBar progress={85} size={48} strokeWidth={6} />
              </div>
            </div>
          </div>

          {/* Candidate 3 */}
          <div className="bg-black p-6 rounded-lg shadow-lg flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-teal-500">3. Emma Wilson</h3>
              <div className="text-gray-300 mb-2">
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full mr-2">Vue</span>
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full mr-2">TypeScript</span>
                <span className="bg-teal-500 text-white px-3 py-1 rounded-full">GCP</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-bold text-teal-500">78</div>
              <div className="w-12 h-12">
                <CircularProgressBar progress={78} size={48} strokeWidth={6} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindCandidates;
