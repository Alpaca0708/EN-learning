import mongoose from "mongoose";

const SeriesSchema = new mongoose.Schema(
  {
    // 影集標題，例如 "Friends"
    title: {
      type: String,
      required: true,
      trim: true, // 移除前後空白
    },
    // 用於 URL 的唯一識別符，例如 "friends"
    // 建立索引 (index) 可以加快查詢速度
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    // 影集簡介
    description: {
      type: String,
      required: true,
    },
    // 影集海報圖片的 URL
    posterImageUrl: {
      type: String,
      required: true,
    },
    // 關聯到這部影集的所有「季」
    // 這是一個 ObjectId 的陣列，每個 ID 都指向 'Season' collection 的一個文件
    seasons: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Season",
      },
    ],
  },
  { timestamps: true }
); // timestamps 會自動加入 createdAt 和 updatedAt 欄位

export default mongoose.models.Series || mongoose.model("Series", SeriesSchema);
