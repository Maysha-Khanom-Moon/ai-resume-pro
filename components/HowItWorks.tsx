// components/HowItWorks.tsx

'use client'

const HowItWorks = () => {
  return (
    <section className="bg-dark text-white py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-semibold mb-4">
          From Resume to <span className="text-teal-500">Dream Job</span>
        </h2>
        <p className="text-lg text-gray-300 mb-12">
          Our AI analyzes your resume and provides personalized recommendations to help you stand out.
        </p>

        {/* Feature Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Block 1: Upload Your Resume */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white">
                <span className="text-xl">📤</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">Upload Your Resume</h3>
            <p className="text-gray-300">Support for PDF and DOCX formats. Manage multiple versions with ease.</p>
          </div>

          {/* Block 2: AI-Powered Analysis */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white">
                <span className="text-xl">🤖</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">AI-Powered Analysis</h3>
            <p className="text-gray-300">Our AI extracts skills, experience, and education to build your profile.</p>
          </div>

          {/* Block 3: Job-Specific Matching */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white">
                <span className="text-xl">💼</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">Job-Specific Matching</h3>
            <p className="text-gray-300">Get fit scores and improvement suggestions for any job description.</p>
          </div>

          {/* Block 4: Actionable Insights */}
          <div className="bg-black p-6 rounded-lg shadow-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white">
                <span className="text-xl">📊</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-teal-500 mb-4">Actionable Insights</h3>
            <p className="text-gray-300">Know exactly what to improve to increase your chances of getting hired.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
