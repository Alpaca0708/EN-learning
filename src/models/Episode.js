import mongoose from "mongoose";

const EpisodeSchema = new mongoose.Schema(
  {
    episodeNumber: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    season: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true,
    },
    // **關鍵欄位**：這集總共有多少個片段
    // 你不需要為每個片段建立文件，只需要知道數量
    clipCount: {
      type: Number,
      required: true,
      default: 0,
    },
    // **建議新增**：儲存這集在 Google Cloud Storage 中的路徑前綴
    // 例如: "series/friends/season-1/episode-1"
    // 這樣前端就可以動態組合出片段的路徑，例如 `${gcsPathPrefix}/clip-0.mp4`
    gcsPathPrefix: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Episode ||
  mongoose.model("Episode", EpisodeSchema);
