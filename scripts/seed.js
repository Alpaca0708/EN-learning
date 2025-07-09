// Step 1: Import modules using the modern ES Module syntax.
import mongoose from 'mongoose';
import Series from '../src/models/Series.js';
import Season from '../src/models/Season.js';
import Episode from '../src/models/Episode.js';

// --- Data Definition ---
// This part remains the same.
const seriesData = [
  {
    title: "Breaking Bad",
    slug: "breaking-bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    posterImageUrl: "/posters/breaking-bad.jpg",
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          { episodeNumber: 1, title: "Pilot", clipCount: 20 },
          { episodeNumber: 2, title: "Cat's in the Bag...", clipCount: 14 },
          { episodeNumber: 3, title: "...And the Bag's in the River", clipCount: 9 },
          { episodeNumber: 4, title: "Cancer Man", clipCount: 19 },
          { episodeNumber: 5, title: "Gray Matter", clipCount: 20 },
          { episodeNumber: 6, title: "Crazy Handful of Nothin'", clipCount: 10 },
          { episodeNumber: 7, title: "A No-Rough-Stuff-Type Deal", clipCount: 13 },
        ]
      }
    ]
  }
];

// --- Seeding Logic ---
const seedDatabase = async () => {
  // Step 2: Access environment variables directly.
  // We will load the .env.local file using a command-line flag instead of the dotenv package.
  const dbUri = process.env.MONGODB_URI;
  if (!dbUri) {
    console.error("Error: MONGODB_URI is not defined. Make sure you are running the script with --env-file=.env.local");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log("Database connected!");

    console.log("Clearing old data...");
    await Episode.deleteMany({});
    await Season.deleteMany({});
    await Series.deleteMany({});
    console.log("Old data cleared.");

    console.log("Seeding new data...");
    for (const seriesItem of seriesData) {
      const newSeries = new Series({
        title: seriesItem.title,
        slug: seriesItem.slug,
        description: seriesItem.description,
        posterImageUrl: seriesItem.posterImageUrl,
        seasons: [],
      });

      for (const seasonItem of seriesItem.seasons) {
        const newSeason = new Season({
          seasonNumber: seasonItem.seasonNumber,
          series: newSeries._id,
          episodes: [],
        });

        for (const episodeItem of seasonItem.episodes) {
          const gcsPathPrefix = `series/${seriesItem.slug}/season-${seasonItem.seasonNumber}/episode-${episodeItem.episodeNumber}`;
          const newEpisode = new Episode({
            episodeNumber: episodeItem.episodeNumber,
            title: episodeItem.title,
            clipCount: episodeItem.clipCount,
            gcsPathPrefix: gcsPathPrefix,
            season: newSeason._id,
          });
          await newEpisode.save();
          newSeason.episodes.push(newEpisode._id);
        }
        await newSeason.save();
        newSeries.seasons.push(newSeason._id);
      }
      await newSeries.save();
      console.log(`✅ Seeded series: ${newSeries.title}`);
    }

    console.log("Database seeded successfully!");

  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
};

seedDatabase();