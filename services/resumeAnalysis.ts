// services/resumeAnalysis.ts
import pdfParse from 'pdf-parse';  // Correctly importing pdfParse

interface AnalyzeResumeParams {
  resumeUrl?: string;
  resumeFile?: string;  // base64-encoded file data (if uploaded)
  jobDescription: string;
}

interface AnalysisResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  missingKeywords: string[];
  matchingSkills: string[];
  skillGaps: string[];
  overallAssessment: string;
}

// Function to extract text from PDF
const extractTextFromPdf = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(pdfBuffer); // Correct usage of pdfParse
    return data.text;  // Return extracted text from the PDF
  } catch (error) {
    throw new Error('Error extracting text from PDF');
  }
};

export async function analyzeResume({
  resumeUrl,
  resumeFile,
  jobDescription,
}: AnalyzeResumeParams): Promise<AnalysisResult> {
  let resumeText = '';

  // If the resume is a URL, fetch the PDF content
  if (resumeUrl) {
    try {
      const response = await fetch(resumeUrl);

      // Ensure that the response is a PDF (not HTML)
      if (!response.ok || !response.headers.get('content-type')?.includes('application/pdf')) {
        throw new Error('Failed to fetch PDF or invalid content type');
      }

      // Get the PDF buffer
      const pdfBuffer = await response.arrayBuffer();
      resumeText = await extractTextFromPdf(Buffer.from(pdfBuffer));

    } catch (error) {
      throw new Error(`Error fetching or parsing PDF from URL: ${error.message}`);
    }
  } 
  // If the resume is a file (base64)
  else if (resumeFile) {
    // Convert base64 string back to buffer and extract text
    const buffer = Buffer.from(resumeFile.split(',')[1], 'base64');
    resumeText = await extractTextFromPdf(buffer);
  }

  // Simulating an analysis result
  const mockAnalysisResult: AnalysisResult = {
    score: Math.random() * 100,  // Random score between 0 and 100
    summary: "This is a simulated analysis summary.",
    strengths: ["Strong technical skills", "Great communication"],
    weaknesses: ["Lack of leadership experience", "Limited experience with specific tools"],
    suggestions: ["Add leadership experience", "Highlight relevant tools or certifications"],
    missingKeywords: ["JavaScript", "React", "Leadership"],
    matchingSkills: ["JavaScript", "React", "Node.js"],
    skillGaps: ["Python", "Leadership"],
    overallAssessment: "Overall, your resume matches well with the job description. However, adding some more relevant keywords and improving your leadership experience would boost your chances.",
  };

  // In a real implementation, you'd now match resumeText with jobDescription

  return mockAnalysisResult;
}
