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

    // 語音社群相關
    bio: {
      type: String,
      maxlength: 200,
      default: "",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    // 統計資料
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalReplies: {
      type: Number,
      default: 0,
    },

    // 原有欄位
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

// UserSchema.index({ googleId: 1 });
// UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);
