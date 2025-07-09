
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Series from '@/models/Series';
import Season from '@/models/Season'; // Import Season to allow populating

export async function GET(request, { params }) {
  // The { params } object is automatically passed by Next.js for dynamic routes.
  const { slug } = params;

  if (!slug) {
    return NextResponse.json(
      { success: false, message: "Series slug is required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // Find the series by its unique slug and populate the 'seasons' field.
    // .populate() replaces the season ObjectIds with the actual season documents.
    const series = await Series.findOne({ slug }).populate({
      path: 'seasons',
      model: Season, // Explicitly specify the model for the population
      options: { sort: { seasonNumber: 1 } } // Sort seasons by their number
    });

    if (!series) {
      return NextResponse.json(
        { success: false, message: "Series not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: series });

  } catch (error) {
    console.error(`API Error for slug: ${slug}`, error);
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
