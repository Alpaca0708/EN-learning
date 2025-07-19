import mongoose from "mongoose";

const EmailSubscriberSchema = new mongoose.Schema(
  {
    // 邮箱地址（必填，唯一）
    email: {
      type: String,
      required: true,
      unique: true, // 防止重复邮箱
      lowercase: true, // 自动转为小写
      trim: true, // 去除前后空格
    },

    // 订阅状态
    status: {
      type: String,
      //   enum: ["active", "unsubscribed"],
      //   default: "active",
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },

    // 订阅来源
    source: {
      type: String,
      default: "landing_page", // 记录是从哪个页面订阅的
    },

    // 用户兴趣（可选）
    interests: [
      {
        type: String,
        enum: [
          "general",
          "vocabulary",
          "grammar",
          "conversation",
          "pronunciation",
        ],
      },
    ],

    // // 是否已发送欢迎邮件
    // welcomeEmailSent: {
    //   type: Boolean,
    //   default: false,
    // },

    // 用户的学习语言（可选）
    // nativeLanguage: {
    //   type: String,
    //   default: null,
    // },

    // 最后活跃时间
    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt
  }
);

// 添加索引以提高查询效率
EmailSubscriberSchema.index({ email: 1 });
EmailSubscriberSchema.index({ status: 1 });
EmailSubscriberSchema.index({ createdAt: -1 });

export default mongoose.models.EmailSubscriber ||
  mongoose.model("EmailSubscriber", EmailSubscriberSchema);
