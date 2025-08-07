import React from "react";
import { Volume2, CheckCircle, Info } from "lucide-react";

export default function ShadowingRecordCard({ record }) {
  // 解析 AI 回傳內容（可能是字串，先嘗試 parse）
  let ai;
  try {
    ai =
      typeof record.aiText === "string"
        ? JSON.parse(record.aiText)
        : record.aiText;
  } catch {
    ai = { score: "?", suggestion: record.aiText || "資料有誤" };
  }

  // 取出GCP語音真實可播網址，或你需要sign url
  const path = record.userVoicePath || "";
  const audioUrl = path.startsWith("gs://")
    ? `/api/get-audio-url?path=${encodeURIComponent(record.userVoicePath)}`
    : record.userVoicePath || "";

  return (
    <div className="bg-[#1A1720] rounded-2xl p-5 mb-4 shadow flex flex-col gap-2 border border-[#32293a]">
      <div className="flex justify-between items-center mb-2">
        <div>
          <div className="font-semibold text-lg text-[#FFD6D6]">
            {record.targetText}
          </div>
          <div className="text-[#ACB2C7] text-sm mt-1">
            {record.transcript ? (
              <>
                Your speech:{" "}
                <span className="text-white">{record.transcript}</span>
              </>
            ) : (
              <span className="text-gray-400">No transcript</span>
            )}
          </div>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#FFD6D6] text-[#2E1214] font-bold text-lg shadow">
            {record.aiResult?.score ?? "-"}
            /10
          </span>
        </div>
      </div>
      <audio controls src={audioUrl} className="w-full my-1" preload="none">
        Your browser does not support audio playback.
      </audio>
      <div className="flex items-center gap-2 mt-2">
        <Info className="w-5 h-5 text-[#FFD6D6]" />
        <div className="text-[#E8B5B8] text-sm">
          {record.aiResult?.suggestion ?? ""}
        </div>
      </div>
      <div className="text-xs text-[#766c90] mt-1">
        {new Date(record.createdAt).toLocaleString("zh-TW")}
      </div>
    </div>
  );
}
