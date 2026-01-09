import { NextResponse } from 'next/server';
const pdf = require('pdf-parse');
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { pdfUrl, jobDescription } = await req.json();

    // 1. Fetch the PDF and Extract Text
    const response = await fetch(pdfUrl);
    const buffer = Buffer.from(await response.arrayBuffer());
    const pdfData = await pdf(buffer);
    const resumeText = pdfData.text;

    // 2. Prepare the AI Model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Define the Prompt
    const prompt = `
      You are an expert career coach and ATS (Applicant Tracking System) optimizer.
      
      TASK:
      Compare the following Resume Text against the Job Description.
      
      RESUME TEXT:
      ${resumeText}

      JOB DESCRIPTION:
      ${jobDescription}

      PROVIDE FEEDBACK IN JSON FORMAT:
      {
        "matchPercentage": number,
        "missingKeywords": string[],
        "strengths": string[],
        "weaknesses": string[],
        "improvementTips": string[]
      }
    `;

    // 4. Generate Content
    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Clean potential markdown from AI response
    const jsonString = textResponse.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(jsonString));

  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze resume" }, { status: 500 });
  }
}