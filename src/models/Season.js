import mongoose from "mongoose";

const SeasonSchema = new mongoose.Schema(
  {
    seasonNumber: { type: Number, required: true },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Series",
      required: true,
    },
    episodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Episode",
      },
    ],
    // 你也可以在這裡加上季的簡介或海報
  },
  { timestamps: true }
);

export default mongoose.models.Season || mongoose.model("Season", SeasonSchema);
