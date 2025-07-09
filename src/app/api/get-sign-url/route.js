import { Storage } from '@google-cloud/storage';
import { NextResponse } from 'next/server';

// Initialize Google Cloud Storage
const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

const bucketName = 'en-learning-project'; // Your GCS bucket name

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    // Get the full file path prefix from the component (e.g., 'series/breaking-bad/season-1/episode-1/clip-1')
    const filePath = searchParams.get('fileName');

    if (!filePath) {
      return NextResponse.json(
        { success: false, message: "'fileName' parameter is required." },
        { status: 400 }
      );
    }

    const options = {
      version: 'v4',
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    // Generate signed URLs for the video and subtitle files in parallel
    const [videoUrl, subtitleUrl] = await Promise.all([
      storage.bucket(bucketName).file(`${filePath}.mp4`).getSignedUrl(options),
      storage.bucket(bucketName).file(`${filePath}.txt`).getSignedUrl(options),
    ]);

    // Return the signed URLs
    return NextResponse.json({ success: true, videoUrl: videoUrl[0], subtitleUrl: subtitleUrl[0] });

  } catch (error) {
    console.error('Error generating signed URLs:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to generate signed URLs",
        error: error.message
      }, 
      { status: 500 }
    );
  }
}