// components/CTA.tsx

'use client'

import { Button } from "@/components/ui/button"; // Reuse your button component

const CTA = () => {
  return (
    <section className="bg-dark text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        {/* Subtitle */}
        <p className="text-lg text-gray-300 mb-8">
          Join thousands of job seekers who have improved their chances of landing their dream job.
        </p>

        {/* CTA Button */}
        <Button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white py-3 px-8 rounded-lg text-xl">
          Create Free Account →
        </Button>
      </div>
    </section>
  );
};

export default CTA;
