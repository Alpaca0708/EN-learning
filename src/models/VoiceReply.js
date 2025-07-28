import mongoose from "mongoose";

const VoiceReplySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VoicePost",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 語音內容
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },

    // 回覆類型
    type: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },

    // AI 回覆內容（如果是 AI）
    aiContent: {
      text: String,
      prompt: String,
    },

    // 互動統計
    likesCount: {
      type: Number,
      default: 0,
    },

    // 狀態
    status: {
      type: String,
      enum: ["active", "reported", "hidden", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

VoiceReplySchema.index({ postId: 1, createdAt: 1 });
VoiceReplySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.VoiceReply ||
  mongoose.model("VoiceReply", VoiceReplySchema);
