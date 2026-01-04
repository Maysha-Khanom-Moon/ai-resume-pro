// app/api/upload/resume/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('=== RESUME UPLOAD STARTED ===');
    console.log('User:', session.user.email);

    // Get the file from form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `resumes/${session.user.id}/${timestamp}_${sanitizedFilename}`;

    console.log('Uploading to Vercel Blob:', filename);

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('✅ Upload successful:', blob.url);

    // Return the public URL
    return NextResponse.json({
      url: blob.url,
      publicId: filename,
      downloadUrl: blob.downloadUrl,
    });

  } catch (error) {
    console.error('❌ Error uploading file:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to upload file';
    let errorDetails = error instanceof Error ? error.message : 'Unknown error';

    if (errorDetails.includes('BLOB_TOKEN')) {
      errorMessage = 'Upload service not configured. Please add BLOB_READ_WRITE_TOKEN to environment variables.';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    );
  }
}

// Use Node.js runtime (not edge)
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout