
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Series from '@/models/Series';

export async function GET(request) {
  try {
    await dbConnect(); // Ensure database connection

    // Find all documents in the Series collection
    const allSeries = await Series.find({});

    // If no series are found, you might want to return a specific message
    if (!allSeries || allSeries.length === 0) {
      return NextResponse.json({ success: true, data: [], message: "No series found" });
    }

    // Return the found series
    return NextResponse.json({ success: true, data: allSeries });

  } catch (error) {
    // Handle any errors that occur during the process
    console.error("API Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "An error occurred on the server.",
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}
