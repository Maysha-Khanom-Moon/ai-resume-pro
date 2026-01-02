// components/Stats.tsx

'use client'

const Stats = () => {
  return (
    <section className="bg-dark text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold text-gray-700 mb-10">Key Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Stat 1: Match Accuracy */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-teal-500">94%</h3>
            <p className="text-lg text-gray-300">Match Accuracy</p>
          </div>

          {/* Stat 2: Interview Rate */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-teal-500">2.5x</h3>
            <p className="text-lg text-gray-300">Interview Rate</p>
          </div>

          {/* Stat 3: Resumes Analyzed */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-teal-500">50K+</h3>
            <p className="text-lg text-gray-300">Resumes Analyzed</p>
          </div>

          {/* Stat 4: Jobs Matched */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-teal-500">10K+</h3>
            <p className="text-lg text-gray-300">Jobs Matched</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
