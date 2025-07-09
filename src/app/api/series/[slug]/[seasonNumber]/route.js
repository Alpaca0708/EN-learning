
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Series from '@/models/Series';
import Season from '@/models/Season';
import Episode from '@/models/Episode'; // Import Episode model for population

export async function GET(request, { params }) {
  const { slug, seasonNumber } = params;

  if (!slug || !seasonNumber) {
    return NextResponse.json(
      { success: false, message: "Series slug and season number are required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    // 1. Find the series by slug to get its ID
    const series = await Series.findOne({ slug });
    if (!series) {
      return NextResponse.json(
        { success: false, message: "Series not found" },
        { status: 404 }
      );
    }

    // 2. Find the season using both the series ID and the season number
    const season = await Season.findOne({ 
      series: series._id, 
      seasonNumber: seasonNumber 
    }).populate({
      path: 'episodes',
      model: Episode,
      options: { sort: { episodeNumber: 1 } } // Sort episodes by their number
    });

    if (!season) {
      return NextResponse.json(
        { success: false, message: "Season not found for this series" },
        { status: 404 }
      );
    }

    // Add the series title to the response for convenience
    const responseData = {
      ...season.toObject(),
      seriesTitle: series.title,
      seriesSlug: series.slug
    };

    return NextResponse.json({ success: true, data: responseData });

  } catch (error) {
    console.error(`API Error for slug: ${slug}, season: ${seasonNumber}`, error);
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
