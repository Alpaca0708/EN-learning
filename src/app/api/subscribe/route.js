import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import EmailSubscriber from "@/models/EmailSubscriber";

export async function POST(request) {
  try {
    const {
      email,
      source = "landing_page",
      interests = [],
    } = await request.json();

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    await dbConnect();

    // 检查是否已存在
    const existingSubscriber = await EmailSubscriber.findOne({
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      if (existingSubscriber.status === "unsubscribed") {
        // 如果之前取消订阅，重新激活
        existingSubscriber.status = "active";
        existingSubscriber.lastActive = new Date();
        existingSubscriber.source = source;
        await existingSubscriber.save();

        return NextResponse.json({
          success: true,
          message: "Welcome back! You're now subscribed again.",
        });
      } else {
        return NextResponse.json(
          { success: false, message: "This email is already subscribed" },
          { status: 400 }
        );
      }
    }

    // 创建新订阅者
    const subscriber = new EmailSubscriber({
      email: email.toLowerCase(),
      source,
      interests,
      lastActive: new Date(),
    });

    await subscriber.save();

    // TODO: 这里可以添加发送欢迎邮件的逻辑
    // await sendWelcomeEmail(email);

    return NextResponse.json({
      success: true,
      message:
        "Thanks for subscribing! Check your email for a welcome message.",
    });
  } catch (error) {
    console.error("Subscription error:", error);

    // 处理数据库重复键错误
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "This email is already subscribed" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 }
    );
  }
}

// 获取订阅统计信息（可选）
export async function GET() {
  try {
    await dbConnect();

    const activeCount = await EmailSubscriber.countDocuments({
      status: "active",
    });
    const totalCount = await EmailSubscriber.countDocuments();

    return NextResponse.json({
      success: true,
      data: {
        activeSubscribers: activeCount,
        totalSubscribers: totalCount,
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to get statistics" },
      { status: 500 }
    );
  }
}
