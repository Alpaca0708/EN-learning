import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reporterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 檢舉目標
    targetType: {
      type: String,
      enum: ["post", "reply"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    // 檢舉原因
    reason: {
      type: String,
      enum: [
        "inappropriate_language",
        "spam",
        "harassment",
        "not_english",
        "other",
      ],
      required: true,
    },
    description: {
      type: String,
      maxlength: 500,
    },

    // 處理狀態
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved", "dismissed"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: Date,
  },
  { timestamps: true }
);

ReportSchema.index({ targetType: 1, targetId: 1 });
ReportSchema.index({ status: 1, createdAt: 1 });

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
