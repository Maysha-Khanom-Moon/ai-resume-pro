"use client";
import { useState } from 'react';

export default function ResumeAnalyzer() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

// Inside ResumeCheckerView.tsx

  const handleAnalyze = async () => {
    if (!pdfUrl.trim()) {
      alert('Please provide a resume URL');
      return;
    }
    
    if (!jobDescription.trim()) {
      alert('Please provide a job description');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          resumeUrl: pdfUrl, 
          jobDescription 
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Analysis failed');

      setResult(data); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Resume vs JD Matcher</h1>
      
      <input 
        className="w-full p-2 border rounded text-black"
        placeholder="Link to PDF Resume"
        value={pdfUrl}
        onChange={(e) => setPdfUrl(e.target.value)}
      />
      
      <textarea 
        className="w-full p-2 border rounded text-black h-40"
        placeholder="Paste Job Description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
      />

      <button 
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Analyzing..." : "Analyze Match"}
      </button>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-50 text-black">
          <h2 className="text-xl font-bold">Match: {result.matchPercentage}%</h2>
          <div className="mt-2">
            <strong>Missing Keywords:</strong> {result.missingKeywords?.join(', ')}
          </div>
          <div className="mt-2">
            <strong>Key Tips:</strong>
            <ul className="list-disc ml-5">
              {result.improvementTips?.map((tip: string, i: number) => <li key={i}>{tip}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

function setAnalyzing(arg0: boolean) {
  throw new Error('Function not implemented.');
}
function setError(message: any) {
  throw new Error('Function not implemented.');
}

function setAnalysis(data: any) {
  throw new Error('Function not implemented.');
}

