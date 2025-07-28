import Link from "next/link";
// import Layout from "@/app/components/Layout";
import { ChevronRight } from "lucide-react";
import FavoriteButton from "@/app/components/FavoriteButton";

// Fetches the data for a specific season, including its episodes
async function getSeasonData(slug, seasonNumber) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${apiUrl}/api/series/${slug}/${seasonNumber}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Failed to fetch season data");
  }

  const { data } = await res.json();
  return data;
}

// This page displays all episodes for a given season
export default async function SeasonPage({ params }) {
  const { slug, seasonNumber } = params;
  const season = await getSeasonData(slug, seasonNumber);

  if (!season) {
    return (
      <div className="text-center text-white py-10">
        <h1 className="text-2xl">Season not found.</h1>
      </div>
    );
  }

  console.log("season data:::", season);

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-col items-center py-5 text-white">
      <div className="max-w-4xl w-full">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-lg mb-4 text-gray-400">
          <Link href="/series" className="hover:text-white">
            Series
          </Link>
          <ChevronRight size={20} className="mx-1" />
          <Link href={`/series/${slug}`} className="hover:text-white">
            {season.seriesTitle}
          </Link>
          <ChevronRight size={20} className="mx-1" />
          <span className="text-white">Season {season.seasonNumber}</span>
        </div>

        <h1 className="text-4xl font-bold mb-6">Episodes</h1>

        {/* Episodes List */}
        <div className="flex flex-col gap-3">
          {season.episodes &&
            season.episodes.map((episode) => (
              <div className="flex w-full justify-between items-center">
                <Link
                  href={`/series/${slug}/${seasonNumber}/${episode.episodeNumber}`}
                  key={episode._id}
                  className="w-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200 rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="text-xl font-semibold">
                      Episode {episode.episodeNumber}
                    </p>
                    <p className="text-gray-400">{episode.title}</p>
                  </div>
                  {/* <ChevronRight size={24} /> */}
                  {/* <FavoriteButton episodeId={episode._id} /> */}
                </Link>
                <FavoriteButton episodeId={episode._id} />
              </div>
            ))}
          {(!season.episodes || season.episodes.length === 0) && (
            <p className="text-gray-400">
              No episodes available for this season yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
