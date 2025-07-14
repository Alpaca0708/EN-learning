import Image from "next/image";
import Link from "next/link";
import Layout from "@/app/components/Layout";
import dbConnect from "@/lib/dbConnect";

// Function to fetch series data from our API endpoint
// Using { cache: 'no-store' } to ensure fresh data on every request during development.
// You might want to remove this in production to allow caching.
async function getSeries() {
  // NOTE: When deploying, you must use the full absolute URL of your production environment.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const res = await fetch(`${apiUrl}/api/series`, { cache: "no-store" });

  if (!res.ok) {
    // This will be caught by the nearest error.js boundary
    throw new Error("Failed to fetch series data");
  }

  const { data } = await res.json();
  return data;
}

// This is a Server Component. It fetches data on the server before rendering.
export default async function SeriesPage() {
  // const seriesList = await getSeries();
  await dbConnect();
  const seriesList = await Series.find({});

  return (
    <Layout>
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-white tracking-light text-[32px] font-bold leading-tight min-w-72">
              Series
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-4 p-4">
            {/* Map over the fetched data and render a card for each series */}
            {seriesList &&
              seriesList.map((series) => (
                <Link
                  href={`/series/${series.slug}`}
                  key={series._id}
                  className="flex flex-col gap-3 pb-3 group"
                >
                  <div className="overflow-hidden">
                    <Image
                      alt={series.title}
                      width={176}
                      height={235}
                      className="bg-center bg-no-repeat aspect-[3/4] bg-cover object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out rounded-lg"
                      // Assuming posterImageUrl is a relative path like /posters/breaking-bad.jpg
                      // which corresponds to the /public directory.
                      // src={series.posterImageUrl}
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbLVF-k1oByCa8VZKOiPr5bCSrXvFNtogF0DyEPX8fa-orUk6rYH2LApGSr_TJUBR67l26_RTZqffxiSZR9XqEJq1sv9JGPeiuf1Cp6FoCzsP5s7o3g6BJ83IUVT187U9SH_LbNj-5I4A7KoiHWCmrvTOlVYhjz6rb3_EeSzaQc4CQdF9FaE60tB6OzwFTk4Cw9IIBNnHwKvrPPixMVTlRJ0gBMvnrm5cXxFLGV0xBQi8VALq_PUX5bDmd5a1tHt3Xp0nWgUU_10k"
                    />
                  </div>
                  <p className="text-white text-base font-medium leading-normal group-hover:text-gray-300">
                    {series.title}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
