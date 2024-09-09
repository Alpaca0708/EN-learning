// pages/api/generate-signed-url.js

import { Storage } from '@google-cloud/storage';


const storage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  },
});

// export async function handler(req, res) {
//   const { fileName } = req.query;  // 从请求参数中获取文件名

//   if (!fileName) {
//     return res.status(400).json({ error: 'Missing fileName parameter' });
//   }

//   const options = {
//     version: 'v4',
//     action: 'read',
//     expires: Date.now() + 15 * 60 * 1000, // 15 分钟后过期
//   };

//   try {
//     const [url] = await storage
//       .bucket('en-learning-project') // 替换为你的 bucket 名称
//       .file(`breaking_bad/Season_1/Episode_1/${fileName}`) // 使用请求参数中的文件名
//       .getSignedUrl(options);

//     res.status(200).json({ url });
//   } catch (error) {
//     console.error('Error generating signed URL:', error);
//     res.status(500).json({ error: 'Failed to generate signed URL' });
//   }
// }
// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const fileName = searchParams.get('fileName');

//   const options = {
//     version: 'v4',
//     action: 'read',
//     expires: Date.now() + 15 * 60 * 1000, // 15 minutes
//   };

//   const [videoUrl] = await storage
//     .bucket('en-learning-project')
//     .file(`breaking_bad/Season_1/Episode_2/${fileName}.mp4`)
//     .getSignedUrl(options);

//   const [subtitleUrl] = await storage
//     .bucket('en-learning-project')
//     .file(`breaking_bad/Season_1/Episode_2/${fileName}.txt`)
//     .getSignedUrl(options);

//   // console.log('Generated signed URL:', subtitleUrl);

//   // return new Response(JSON.stringify({ url }), { status: 200 });

//   return new Response(JSON.stringify({ videoUrl, subtitleUrl }), { status: 200 });

// }

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const season = searchParams.get('season');
    const episode = searchParams.get('episode');
    const fileName = searchParams.get('fileName');

    if (!season || !episode || !fileName) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    const bucketName = 'en-learning-project';
    const basePath = `breaking_bad/${season}/${episode}/`;

    // const options = {
    //   version: 'v4',
    //   action: 'read',
    //   expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    // };

    // // 取得影片的已簽名 URL
    // const [videoUrl] = await storage
    //   .bucket(bucketName)
    //   .file(`${basePath}${fileName}.mp4`)
    //   .getSignedUrl(options);

    // // 取得字幕的已簽名 URL
    // const [subtitleUrl] = await storage
    //   .bucket(bucketName)
    //   .file(`${basePath}${fileName}.txt`)
    //   .getSignedUrl(options);
    const [videoUrl, subtitleUrl] = await Promise.all([
      storage.bucket(bucketName).file(`${basePath}${fileName}.mp4`).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      }),
      storage.bucket(bucketName).file(`${basePath}${fileName}.txt`).getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      })
    ]);

    // 回傳已簽名的 URL
    return new Response(JSON.stringify({ videoUrl, subtitleUrl }), { status: 200 });
  } catch (error) {
    console.error('Error generating signed URLs:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate signed URLs' }), { status: 500 });
  }
}


