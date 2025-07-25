import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // Google OAuth 資料
    googleId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    image: String,

    // 學習相關資料
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      subtitleSize: {
        type: String,
        default: "medium",
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
    },

    // 統計資料
    totalWatchTime: {
      type: Number,
      default: 0, // 秒數
    },
    totalNotes: {
      type: Number,
      default: 0,
    },

    // 訂閱狀態（為未來付費功能準備）
    subscription: {
      type: String,
      enum: ["free", "basic", "pro", "premium"],
      default: "free",
    },

    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// 添加索引
UserSchema.index({ googleId: 1 });
UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
