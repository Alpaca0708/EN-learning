import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/lib/dbConnect";
import Favorite from "@/models/Favorite";
import mongoose from "mongoose";
import User from "@/models/User";

export async function POST(request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 });
    }

    await dbConnect();
    let user = await User.findOne({ email: session.user.email });

    if (!user) {
      // 如果用戶不存在，創建新用戶（理論上 NextAuth 登入時應該已經創建）

      user = await User.create({
        googleId: session.user.sub || session.user.email, // 暫時用 email
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      });
    }

    const { episodeId } = await request.json();

    if (!episodeId || !mongoose.Types.ObjectId.isValid(episodeId)) {
      return NextResponse.json({ error: "無效的影集 ID" }, { status: 400 });
    }

    // if (!mongoose.Types.ObjectId.isValid(episodeId)) {
    //   console.log("❌ 無效的 episodeId 格式:", episodeId);
    //   return NextResponse.json(
    //     { error: "無效的影集 ID 格式" },
    //     { status: 400 }
    //   );
    // }

    // console.log("🎯 收藏資料:", {
    //   userEmail: session.user.email,
    //   episodeId: episodeId,
    // });

    // 先檢查是否已經收藏 - 修正字段名
    const existingFavorite = await Favorite.findOne({
      userId: user._id,
      episodeId: new mongoose.Types.ObjectId(episodeId),
    });

    if (existingFavorite) {
      return NextResponse.json({
        success: true,
        message: "已經在收藏清單中了！",
      });
    }

    const favorite = new Favorite({
      userId: user._id,
      episodeId: new mongoose.Types.ObjectId(episodeId),
    });

    const savedFavorite = await favorite.save();

    return NextResponse.json({
      success: true,
      message: "success",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "fail to add",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "please login" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "user not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const episodeId = searchParams.get("episodeId");

    if (!episodeId || !mongoose.Types.ObjectId.isValid(episodeId)) {
      return NextResponse.json(
        { error: "invalid episode ID" },
        { status: 400 }
      );
    }

    // const result = await Favorite.deleteOne({
    //   userId: user._id,
    //   episodeId: new mongoose.Types.ObjectId(episodeId),
    // });

    return NextResponse.json({
      success: true,
      message: "success remove",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "fail to remove",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: "請先登入" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ favorites: [] });
    }

    const favorites = await Favorite.find({ userId: user._id })
      .populate("episodeId", "title episodeNumber")
      .sort({ createdAt: -1 });

    return NextResponse.json({ favorites });
  } catch (error) {
    return NextResponse.json(
      {
        error: "獲取收藏列表失敗",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
