
import Layout from '@/app/components/Layout';
import EpisodePlayer from '@/app/components/EpisodePlayer';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Fetches the initial data for the episode
async function getEpisodeData(slug, seasonNumber, episodeNumber) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/api/series/${slug}/${seasonNumber}/${episodeNumber}`, { cache: 'no-store' });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch episode data');
  }

  const { data } = await res.json();
  return data;
}

// This is the main page component (a Server Component)
export default async function EpisodePage({ params }) {
  const { slug, seasonNumber, episodeNumber } = params;
  const episode = await getEpisodeData(slug, seasonNumber, episodeNumber);

  if (!episode) {
    return (
      <Layout>
        <div className="text-center text-white py-10">
          <h1 className="text-2xl">Episode not found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-col items-center py-5 text-white">
        <div className="max-w-4xl w-full">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-lg mb-2 text-gray-400 flex-wrap">
            <Link href="/series" className="hover:text-white">Series</Link>
            <ChevronRight size={20} className="mx-1" />
            <Link href={`/series/${slug}`} className="hover:text-white">{episode.seriesTitle}</Link>
            <ChevronRight size={20} className="mx-1" />
            <Link href={`/series/${slug}/${seasonNumber}`} className="hover:text-white">Season {episode.seasonNumber}</Link>
            <ChevronRight size={20} className="mx-1" />
            <span className="text-white">Episode {episode.episodeNumber}</span>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">{episode.title}</h1>

          {/* The Client Component for the player is rendered here */}
          <EpisodePlayer episodeData={episode} />

        </div>
      </div>
    </Layout>
  );
}
