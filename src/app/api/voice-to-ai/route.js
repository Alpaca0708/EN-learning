import { Readable } from "stream";
import { Storage } from "@google-cloud/storage";
import Busboy from "busboy";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
});

const bucketName = "voice-post";

async function parseForm(req) {
  return new Promise(async (resolve, reject) => {
    const busboy = Busboy({ headers: Object.fromEntries(req.headers) });
    let fileBuffer = [];
    let fileInfo = {};

    busboy.on("file", (fieldname, file, info) => {
      fileInfo = info;
      file.on("data", (data) => {
        fileBuffer.push(data);
      });
    });

    busboy.on("finish", () => {
      resolve({
        file: {
          buffer: Buffer.concat(fileBuffer),
          ...fileInfo,
        },
      });
    });

    busboy.on("error", reject);

    const arrayBuffer = await req.arrayBuffer();
    busboy.end(Buffer.from(arrayBuffer));
  });
}

export async function POST(req) {
  try {
    // const voiceFile = files.file;
    // if (!voiceFile) {
    //   return NextResponse.json(
    //     { success: false, message: "缺少語音檔案" },
    //     { status: 400 }
    //   );
    // }
    const { file } = await parseForm(req);
    if (!file || !file.buffer) {
      return NextResponse.json(
        { success: false, message: "缺少語音檔案" },
        { status: 400 }
      );
    }

    // 儲存用戶語音檔案
    const userVoicePath = `user-posts/${Date.now()}-${file.filename || "audio.webm"}`;
    // await storage.bucket(bucketName).upload(voiceFile.filepath, {
    //   destination: userVoicePath,
    //   contentType: voiceFile.mimetype || "audio/webm",
    //   public: false,
    // });
    const fileUpload = storage.bucket(bucketName).file(userVoicePath);
    await fileUpload.save(file.buffer, {
      contentType: file.mimeType || "audio/webm",
      public: false,
    });

    // 假 AI 回覆（真 AI 回覆之後再串）
    const fakeAiText = "你好，這是 AI 的回覆內容";
    // 假語音檔也上傳 GCP（這裡你可以放個現有 mp3 做測試，或直接給一個測試 mp3 網址）
    const fakeAiAudioUrl =
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3";

    // 回傳給前端
    return NextResponse.json({
      success: true,
      text: fakeAiText,
      audioUrl: fakeAiAudioUrl,
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
