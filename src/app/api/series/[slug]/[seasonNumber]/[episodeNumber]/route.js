
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Series from '@/models/Series';
import Season from '@/models/Season';
import Episode from '@/models/Episode';

export async function GET(request, { params }) {
  const { slug, seasonNumber, episodeNumber } = params;

  if (!slug || !seasonNumber || !episodeNumber) {
    return NextResponse.json(
      { success: false, message: "Series slug, season number, and episode number are required." },
      { status: 400 }
    );
  }

  try {
    await dbConnect();

    const series = await Series.findOne({ slug });
    if (!series) {
      return NextResponse.json({ success: false, message: "Series not found" }, { status: 404 });
    }

    const season = await Season.findOne({ series: series._id, seasonNumber: seasonNumber });
    if (!season) {
      return NextResponse.json({ success: false, message: "Season not found" }, { status: 404 });
    }

    const episode = await Episode.findOne({ season: season._id, episodeNumber: episodeNumber });
    if (!episode) {
      return NextResponse.json({ success: false, message: "Episode not found" }, { status: 404 });
    }

    // For convenience, add series and season info to the response
    const responseData = {
      ...episode.toObject(),
      seriesTitle: series.title,
      seriesSlug: series.slug,
      seasonNumber: season.seasonNumber,
    };

    return NextResponse.json({ success: true, data: responseData });

  } catch (error) {
    console.error(`API Error for ${slug}/s${seasonNumber}/e${episodeNumber}`, error);
    return NextResponse.json(
      { success: false, message: "An error occurred on the server.", error: error.message },
      { status: 500 }
    );
  }
}
