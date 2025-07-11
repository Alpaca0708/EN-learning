import Image from "next/image";
import Link from "next/link";
import Layout from "@/app/components/Layout";

// This function fetches the data for a single series by its slug.
const getSeriesData = async (slug) => {
  const apiUrl = process.env.NEXT_API_URL || "http://localhost:3000";
  const res = await fetch(`${apiUrl}/api/series/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // You can create a custom not-found page later.
    if (res.status === 404) return null;
    throw new Error("Failed to fetch series data");
  }

  const { data } = await res.json();
  return data;
};

// This is a dynamic page component.
// The `params` object contains the dynamic parts of the URL, in this case, the `slug`.
export default async function SingleSeriesPage({ params }) {
  const { slug } = params;
  const series = await getSeriesData(slug);

  // If the series is not found, you can render a custom message or a not-found component.
  if (!series) {
    return (
      <Layout>
        <div className="text-center text-white py-10">
          <h1 className="text-2xl">Series not found.</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-col items-center py-5 text-white">
        <div className="max-w-4xl w-full">
          {/* Series Details Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3">
              <Image
                alt={series.title}
                width={300}
                height={450}
                className="bg-center bg-no-repeat aspect-[3/4] bg-cover object-cover w-full h-full rounded-lg shadow-lg"
                // src={series.posterImageUrl}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbLVF-k1oByCa8VZKOiPr5bCSrXvFNtogF0DyEPX8fa-orUk6rYH2LApGSr_TJUBR67l26_RTZqffxiSZR9XqEJq1sv9JGPeiuf1Cp6FoCzsP5s7o3g6BJ83IUVT187U9SH_LbNj-5I4A7KoiHWCmrvTOlVYhjz6rb3_EeSzaQc4CQdF9FaE60tB6OzwFTk4Cw9IIBNnHwKvrPPixMVTlRJ0gBMvnrm5cXxFLGV0xBQi8VALq_PUX5bDmd5a1tHt3Xp0nWgUU_10k"
              />
            </div>
            <div className="w-full md:w-2/3">
              <h1 className="text-4xl font-bold mb-2">{series.title}</h1>
              <p className="text-lg text-gray-300 mb-4">{series.description}</p>
            </div>
          </div>

          {/* Seasons Section */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold border-b-2 border-gray-700 pb-2 mb-4">
              Seasons
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {series.seasons &&
                series.seasons.map((season) => (
                  <Link
                    href={`/series/${slug}/${season.seasonNumber}`}
                    key={season._id}
                    className="bg-gray-800 hover:bg-gray-700 transition-colors duration-200 rounded-lg p-4 text-center"
                  >
                    <span className="text-xl font-semibold">
                      Season {season.seasonNumber}
                    </span>
                  </Link>
                ))}
            </div>
            {(!series.seasons || series.seasons.length === 0) && (
              <p className="text-gray-400">
                No seasons available for this series yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
