import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    episodeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Episode",
      required: true,
    },
    clipIndex: {
      type: Number,
      required: true,
    },
    timestamp: {
      type: Number, // 影片中的時間點（秒）
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    highlightedText: {
      type: String, // 用戶高亮的字幕文字
      maxlength: 200,
    },
    vocabulary: [
      {
        word: String,
        definition: String,
        context: String,
      },
    ],
    tags: [String],
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// 複合索引
NoteSchema.index({ userId: 1, episodeId: 1 });
NoteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
