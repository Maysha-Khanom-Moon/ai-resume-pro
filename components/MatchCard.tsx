// components/MatchCard.tsx

'use client'

const MatchCard = () => {
  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      {/* Resume Title */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Senior_Developer_Resume.pdf</h2>
        <span className="text-gray-400 text-sm">matched with "Senior Frontend Developer at TechCorp"</span>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <h3 className="font-medium">Skills:</h3>
        <ul className="list-disc pl-6">
          <li className="text-gray-300">React</li>
          <li className="text-gray-300">TypeScript</li>
          <li className="text-gray-300">Node.js</li>
        </ul>
      </div>

      {/* Experience */}
      <div className="mb-4">
        <h3 className="font-medium">Experience:</h3>
        <p className="text-gray-300">5+ years experience</p>
      </div>

      {/* Suggested Additions */}
      <div className="mb-4 text-yellow-400">
        <h3 className="font-medium">Suggestions to Add:</h3>
        <ul className="list-disc pl-6">
          <li>GraphQL</li>
          <li>AWS experience</li>
        </ul>
      </div>

      {/* Match Score & Status */}
      <div className="flex justify-between items-center">
        <div className="text-4xl font-bold text-teal-500">78</div>
        <div className="text-lg text-gray-300">Good</div>
      </div>

      {/* Circular Progress Bar (Static) */}
      <div className="mt-6">
        <div className="w-24 h-24 rounded-full border-4 border-teal-500 flex items-center justify-center text-teal-500 text-xl">
          78%
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
