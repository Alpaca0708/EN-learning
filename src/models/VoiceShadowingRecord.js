import mongoose from "mongoose";

const VoiceShadowingRecordSchema = new mongoose.Schema({
  userId: {
    // 使用者唯一識別（可用 ObjectId，對應 users collection）
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  audioUrl: {
    // 語音檔案在 GCP 的存放路徑（或 public url）
    type: String,
    required: true,
  },
  transcript: {
    // 語音轉文字後的結果
    type: String,
    required: true,
  },
  targetText: {
    // 目標句（練習的 subtitle），optional
    type: String,
    default: "",
  },
  aiResult: {
    // AI 回傳的完整 JSON，例如 {score, suggestion, correction, advanced...}
    type: Object,
    required: true,
  },
  createdAt: {
    // 練習時間
    type: Date,
    default: Date.now,
    index: true,
  },
});

export default mongoose.models.VoiceShadowingRecord ||
  mongoose.model("VoiceShadowingRecord", VoiceShadowingRecordSchema);
