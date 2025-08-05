// import { Storage } from "@google-cloud/storage";
// // import formidable from "formidable";
// import { NextResponse } from "next/server";

// // export const config = {
// //   api: {
// //     bodyParser: false, // 禁用 Next.js 預設 bodyParser
// //   },
// // };

// const storage = new Storage({
//   projectId: process.env.GOOGLE_PROJECT_ID,
//   credentials: {
//     client_email: process.env.GOOGLE_CLIENT_EMAIL,
//     private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   },
// });

// const bucketName = "voice-post";

// // 工具函式：把表單解析成 promise
// const parseForm = (req) =>
//   new Promise((resolve, reject) => {
//     const form = formidable();
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       else resolve({ fields, files });
//     });
//   });

// export async function POST(req) {
//   try {
//     // 解析 multipart/form-data
//     const { files, fields } = await parseForm(req);

//     // 假設前端 input name="voice"
//     const voiceFile = files.voice;
//     if (!voiceFile) {
//       return NextResponse.json(
//         { success: false, message: "lack of voice file" },
//         { status: 400 }
//       );
//     }

//     // 路徑命名，這裡你可以根據 userId/postId 自己客製
//     const { userId = "testuser", postId = "testpost", replyId = "" } = fields;

//     let gcsFilePath;
//     if (replyId) {
//       gcsFilePath = `${userId}/${postId}/replies/${replyId}.mp3`;
//     } else {
//       gcsFilePath = `${userId}/${postId}/main.mp3`;
//     }

//     // 上傳到 GCP
//     await storage.bucket(bucketName).upload(voiceFile.filepath, {
//       destination: gcsFilePath,
//       contentType: voiceFile.mimetype || "audio/mpeg",
//       public: false, // 保持非公開
//     });

//     // 傳回雲端路徑
//     return NextResponse.json({ success: true, filePath: gcsFilePath });
//   } catch (error) {
//     console.error("fail to upload voice:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }
