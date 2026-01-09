// app/api/resume/analyze/route.ts
import { NextResponse } from 'next/server';
import { analyzeResume } from '@/services/resumeAnalysis';  // Import the analyzeResume function
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeUrl, resumeFile, jobDescription } = await req.json();

    if (!resumeUrl && !resumeFile) {
      return NextResponse.json({ error: 'No resume provided' }, { status: 400 });
    }

    if (!jobDescription) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    // Call the analyzeResume function with the provided data
    const analysisResult = await analyzeResume({
      resumeUrl,
      resumeFile,
      jobDescription,
    });

    return NextResponse.json({ analysis: analysisResult });

  } catch (error) {
    console.error('Error analyzing resume:', error);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
