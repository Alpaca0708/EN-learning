import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import VoiceShadowingRecord from "@/models/VoiceShadowingRecord";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  // 查詢當前用戶的所有 shadowing record
  const records = await VoiceShadowingRecord.find({ userId: session.user.id })
    .sort({ createdAt: -1 }) // 新→舊
    // .populate("episodeId") // 如果有需要把劇集細節一起查
    .lean();

  // 如要處理 GCP 音檔（建議前端再請求 API 拿簽名網址）
  // records = records.map(r => ({ ...r, signedAudioUrl: ... }));

  return NextResponse.json({ records });
}
