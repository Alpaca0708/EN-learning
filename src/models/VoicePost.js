import mongoose from "mongoose";

const VoicePostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 語音內容
    audioUrl: {
      type: String,
      required: true, // Google Cloud Storage URL
    },
    duration: {
      type: Number,
      required: true, // 秒數
    },

    // 文字內容（可選）
    title: {
      type: String,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },

    // 相關影集（可選）
    relatedEpisode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
    },

    // 互動統計
    likesCount: {
      type: Number,
      default: 0,
    },
    repliesCount: {
      type: Number,
      default: 0,
    },

    // 狀態
    status: {
      type: String,
      enum: ["active", "reported", "hidden", "deleted"],
      default: "active",
    },

    // AI 回覆狀態
    aiReplied: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

VoicePostSchema.index({ userId: 1, createdAt: -1 });
VoicePostSchema.index({ status: 1, createdAt: -1 });

export default mongoose.models.VoicePost ||
  mongoose.model("VoicePost", VoicePostSchema);
