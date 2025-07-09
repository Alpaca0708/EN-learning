"use client";
import Image from "next/image";
import "./globals.css";
import { useEffect, useState } from "react";
import { PlayCircle, MessageCircle, Ear, CircleCheck } from "lucide-react";
import Layout from "@/app/components/Layout";
import Link from "next/link";
// import VideoCard from '@/app/components/VideoCard';

// export default function Home() {
//   const [videioUrl, setVideoUrl] = useState(null);

//   useEffect(() => {
//     async function fetchClips() {
//       try {
//         // 使用季節和集數獲取對應片段
//         const response = await fetch(`/api/get-sign-url?season=Season_1&episode=Episode_5&fileName=3`);
//         if (!response.ok) {
//           throw new Error('Failed to fetch signed URLs');
//         }
//         const data = await response.json();
//         // setClips(data.clips); // clips 是包含每個片段的 URL 和字幕 URL 的陣列
//         setVideoUrl(data.videoUrl)
//         // const subtitleResponse = await fetch(data.subtitleUrl);
//         // const subtitleText = await subtitleResponse.text();
//         // setSubtitleText(subtitleText);

//         // setClipIndex(0); // 每次更換集數時，從第一個片段開始
//       } catch (error) {
//         console.error('Error fetching clips:', error);
//       }
//     }

//     fetchClips();
//   }, []);

//   return (
//     <Layout>
//       <main className="flex-1 justify-center">
//         <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 xl:py-48 bg-[#dde5b6]">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
//                   Learn English with Your Favorite TV Shows
//                 </h1>
//                 <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
//                   Master English naturally and enjoyably through popular TV series. Improve your vocabulary, pronunciation, and cultural understanding.
//                 </p>
//               </div>
//               <div className="space-x-4">
//                 <Link href="/video" passHref
//                   className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-bold text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300">
//                   Get started
//                 </Link>
//                 {/* <button className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300">
//                   Get Started
//                 </button> */}
//                 <button className="border-[#adc178] border-2 h-9 rounded-md p-2 inline-flex justify-center items-center hover:bg-[#adc178] hover:text-white font-bold">
//                   Log in
//                 </button>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
//           <div className=" container px-4 md:px-6">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">How It Works</h2>
//             <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
//               <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
//                 {/* <PlayCircle className="h-12 w-12 text-gray-800 dark:text-gray-100" /> */}
//                 <h3 className="text-xl font-bold">Watch TV Series Clips</h3>

//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                   Enjoy short, engaging clips from popular TV series
//                 </p>
//                 <video controls className="w-full  rounded-lg shadow-lg"
//                   src={videioUrl} />
//               </div>
//               <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
//                 <Ear className="h-12 w-12 text-gray-800 dark:text-gray-100" />
//                 <h3 className="text-xl font-bold">Learn Vocabulary</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                   Master new words and phrases in context
//                 </p>
//               </div>
//               <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
//                 <MessageCircle className="h-12 w-12 text-gray-800 dark:text-gray-100" />
//                 <h3 className="text-xl font-bold">Practice Speaking</h3>
//                 <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
//                   Improve pronunciation with interactive exercises
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-[#FAF0CA]">
//           <div className="container px-4 md:px-6">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">What Our Learners Say</h2>
//             <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
//               <div className="flex flex-col items-center space-y-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500 dark:text-gray-400 italic">
//                   "I've learned so much English slang and cultural references. It's like having a native speaker as a friend!"
//                 </p>
//                 <p className="text-sm font-bold">- Sarah K., Germany</p>
//               </div>
//               <div className="flex flex-col items-center space-y-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500 dark:text-gray-400 italic">
//                   "The interactive quizzes really help me remember new vocabulary. Plus, it's so much fun!"
//                 </p>
//                 <p className="text-sm font-bold">- Carlos M., Brazil</p>
//               </div>
//               <div className="flex flex-col items-center space-y-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg border">
//                 <p className="text-sm text-gray-500 dark:text-gray-400 italic">
//                   "I love how I can learn English while enjoying my favorite shows. It doesn't even feel like studying!"
//                 </p>
//                 <p className="text-sm font-bold">- Yuki T., Japan</p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full flex justify-center py-12 md:py-24 lg:py-32 bg-[#ccd5ae] dark:bg-gray-800">
//           <div className="container px-4 md:px-6">
//             <h2 className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Ready to Start?</h2>
//             <div className="mx-auto max-w-sm space-y-4">
//               <form className="flex flex-col gap-2 p-3">
//                 <input placeholder="Enter your email" type="email" className="rounded-md h-9 px-2" />
//                 <button type="submit" className=" h-9 rounded-md p-2 inline-flex justify-center items-center bg-gray-900 text-gray-50 ">
//                   Log In for Free Trial
//                 </button>
//               </form>
//               <p className=" text-xs text-center text-white dark:text-gray-400">
//                 No credit card required. Start learning today!
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>
//     </Layout>
//   );
// }

export default function Home() {
  return (
    <Layout></Layout>
    // <div className="relative flex min-h-screen flex-col bg-[#181111] overflow-x-hidden font-[\'Plus Jakarta Sans\',\'Noto Sans\',sans-serif]">
    //   <head>
    //     <title>En learning</title>
    //     <link rel="icon" href="data:image/x-icon;base64," />
    //     <link
    //       rel="preconnect"
    //       href="https://fonts.gstatic.com/"
    //       crossOrigin=""
    //     />
    //     <link
    //       href="https://fonts.googleapis.com/css2?display=swap&family=Noto+Sans:wght@400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;700;800"
    //       rel="stylesheet"
    //     />
    //   </head>

    //   <div className="layout-container flex grow flex-col">
    //     <header className="flex items-center justify-between border-b border-[#382929] px-10 py-3">
    //       <div className="flex items-center gap-8">
    //         <div className="flex items-center gap-4 text-white">
    //           <div className="size-4">
    //             {/* logo SVG */}
    //             <svg
    //               viewBox="0 0 48 48"
    //               fill="none"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
    //                 fill="currentColor"
    //               ></path>
    //               <path
    //                 fillRule="evenodd"
    //                 clipRule="evenodd"
    //                 d="..."
    //                 fill="currentColor"
    //               ></path>
    //             </svg>
    //           </div>
    //           <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">
    //             En learning
    //           </h2>
    //         </div>
    //         <div className="flex items-center gap-9">
    //           {["Home", "Series", "Movies", "Learn"].map((item) => (
    //             <a
    //               key={item}
    //               className="text-white text-sm font-medium"
    //               href="#"
    //             >
    //               {item}
    //             </a>
    //           ))}
    //         </div>
    //       </div>
    //       <div className="flex flex-1 justify-end gap-8">
    //         <label className="flex flex-col min-w-40 h-10 max-w-64">
    //           <div className="flex w-full items-center rounded-lg h-full">
    //             <div className="text-[#b89d9f] bg-[#382929] pl-4 rounded-l-lg">
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 width="24"
    //                 height="24"
    //                 fill="currentColor"
    //                 viewBox="0 0 256 256"
    //               >
    //                 <path d="..." />
    //               </svg>
    //             </div>
    //             <input
    //               className="form-input w-full flex-1 bg-[#382929] text-white placeholder-[#b89d9f] px-4 rounded-r-lg text-base"
    //               placeholder="Search"
    //             />
    //           </div>
    //         </label>
    //         <button className="h-10 px-2.5 flex items-center gap-2 bg-[#382929] text-white text-sm font-bold rounded-lg">
    //           <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             width="20"
    //             height="20"
    //             fill="currentColor"
    //             viewBox="0 0 256 256"
    //           >
    //             <path d="..." />
    //           </svg>
    //         </button>
    //         <div
    //           className="bg-center bg-cover rounded-full size-10"
    //           style={{
    //             backgroundImage: `url('https://lh3.googleusercontent.com/...')`,
    //           }}
    //         ></div>
    //       </div>
    //     </header>

    //     <main className="px-40 py-5 flex flex-1 justify-center">
    //       <div className="max-w-[960px] w-full">
    //         {/* 搜尋列 */}
    //         <div className="px-4 py-3">
    //           <label className="flex flex-col min-w-40 h-12 w-full">
    //             <div className="flex w-full items-center rounded-lg h-full">
    //               <div className="text-[#b89d9f] bg-[#382929] pl-4 rounded-l-lg">
    //                 <svg
    //                   xmlns="http://www.w3.org/2000/svg"
    //                   width="24"
    //                   height="24"
    //                   fill="currentColor"
    //                   viewBox="0 0 256 256"
    //                 >
    //                   <path d="..." />
    //                 </svg>
    //               </div>
    //               <input
    //                 className="form-input w-full flex-1 bg-[#382929] text-white placeholder-[#b89d9f] px-4 rounded-r-lg text-base"
    //                 placeholder="Search for series and movies"
    //               />
    //             </div>
    //           </label>
    //         </div>

    //         {/* Cards 可以做成 map 過資料產出 */}
    //         <div className="flex overflow-x-auto gap-3 px-4 py-4">
    //           {[...Array(3)].map((_, i) => (
    //             <div key={i} className="flex flex-col gap-2 min-w-60">
    //               <div
    //                 className="aspect-video bg-cover bg-center rounded-lg"
    //                 style={{
    //                   backgroundImage: `url('https://lh3.googleusercontent.com/...')`,
    //                 }}
    //               ></div>
    //               <p className="text-white text-base font-medium">
    //                 Movie Title {i + 1}
    //               </p>
    //               <p className="text-[#b89d9f] text-sm">Movie description</p>
    //             </div>
    //           ))}
    //         </div>

    //         <h2 className="text-white text-[22px] font-bold px-4 pb-3 pt-5">
    //           Recommended for you
    //         </h2>
    //         <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 px-4 pb-8">
    //           {[...Array(6)].map((_, i) => (
    //             <div key={i} className="flex flex-col gap-2">
    //               <div
    //                 className="aspect-video bg-cover bg-center rounded-lg"
    //                 style={{
    //                   backgroundImage: `url('https://lh3.googleusercontent.com/...')`,
    //                 }}
    //               ></div>
    //               <p className="text-white text-base font-medium">
    //                 Recommended Movie {i + 1}
    //               </p>
    //             </div>
    //           ))}
    //         </div>
    //       </div>
    //     </main>
    //   </div>
    // </div>
  );
}
