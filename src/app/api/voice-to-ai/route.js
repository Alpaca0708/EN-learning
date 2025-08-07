const { Readable } = require("stream");
import { Storage } from "@google-cloud/storage";
import Busboy from "busboy";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { OpenAI } from "openai";
import VoiceShadowingRecord from "@/models/VoiceShadowingRecord";
import dbConnect from "@/lib/dbConnect";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const bucketName = "voice-post";
// const fileStream = Readable.from(file.buffer);
// fileStream.path = file.filename || "audio.webm";

async function parseForm(req) {
  return new Promise(async (resolve, reject) => {
    const busboy = Busboy({ headers: Object.fromEntries(req.headers) });
    let fileBuffer = [];
    let fileInfo = {};
    let formFields = {};

    busboy.on("file", (fieldname, file, info) => {
      fileInfo = info;
      file.on("data", (data) => {
        fileBuffer.push(data);
      });
    });
    busboy.on("field", (fieldname, val) => {
      formFields[fieldname] = val;
    });

    busboy.on("finish", () => {
      resolve({
        file: {
          buffer: Buffer.concat(fileBuffer),
          ...fileInfo,
        },
        ...formFields,
      });
    });

    busboy.on("error", reject);

    const arrayBuffer = await req.arrayBuffer();
    busboy.end(Buffer.from(arrayBuffer));
  });
}

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { success: false, message: "unauthorized" },
      { status: 401 }
    );
  }
  const userId = session.user.id;
  const { file, targetText } = await parseForm(req);
  if (!file || !file.buffer) {
    return NextResponse.json(
      { success: false, message: "lack of voice file" },
      { status: 400 }
    );
  }

  try {
    // 儲存用戶語音檔案
    const userVoicePath = `user-posts/${userId}/${Date.now()}-${file.filename || "audio.webm"}`;
    const fileUpload = storage.bucket(bucketName).file(userVoicePath);
    await fileUpload.save(file.buffer, {
      contentType: file.mimeType || "audio/webm",
      public: false,
    });

    const fileStream = Readable.from(file.buffer);
    fileStream.path = file.filename || "audio.webm";

    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: "whisper-1",
      response_format: "json",
    });
    const transcript = transcription.text;

    const chatPrompt = `
    You are a professional English speaking coach. Your job is to help users shadow (repeat) sentences from a TV show as accurately as possible.

    Your tasks:
    1. Compare the "User Sentence" (from speech recognition) with the "Target Sentence" (movie subtitle).
    2. Identify all differences (missing, extra, or incorrect words).
    3. Give a similarity score (0-10, 10 = perfect match).
    4. Provide a corrected version of the user's sentence.
    5. Give a short, friendly suggestion to help the user improve (one or two sentences).

    **Output in this JSON format only:**
    {
      "score": 0-10,
      "suggestion": "..."
    }

    Target Sentence: ${targetText}
    User Sentence: ${transcript}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a lively, humorous, and professional IELTS English examiner",
        },
        { role: "user", content: chatPrompt },
      ],
    });
    const aiText = completion.choices[0].message.content;

    let aiResultObj;
    try {
      aiResultObj = JSON.parse(aiText);
    } catch (e) {
      const match =
        aiText.match(/```json\s*([\s\S]*?)```/i) || aiText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          aiResultObj = JSON.parse(match[1] || match[0]);
        } catch (err) {
          aiResultObj = { error: "AI 回傳格式錯誤", raw: aiText };
        }
      } else {
        aiResultObj = { error: "AI 回傳不是 JSON", raw: aiText };
      }
    }

    await dbConnect();
    await VoiceShadowingRecord.create({
      userId, // 從 session.user.id 來
      audioUrl: `gs://${bucketName}/${userVoicePath}`, // 剛剛存到 GCP 的路徑
      transcript, // Whisper 轉出來的
      targetText, // 前端傳過來的 subtitle
      aiResult: aiResultObj, // JSON.parse(aiText)
    });

    // 回傳給前端
    return NextResponse.json({
      success: true,
      text: aiText,
      transcript,
      //   audioUrl: fakeAiAudioUrl,
      userAudioUrl: `gs://${bucketName}/${userVoicePath}`,
    });
  } catch (error) {
    console.error("ai reply fail:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
