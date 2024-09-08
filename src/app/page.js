'use client'
import Image from "next/image";
import './globals.css';
import { useEffect, useState } from "react";
import { PlayCircle, BookOpen, MessageCircle, CheckCircle } from "lucide-react"
import Link from 'next/link';
// import VideoCard from '@/app/components/VideoCard';



export default function Home() {

  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showSubtitles, setShowSubtitles] = useState(false);


  useEffect(() => {
    async function fetchSignedUrls() {
      try {
        const response = await fetch(`/api/get-sign-url?fileName=3`);
        const data = await response.json();
        // console.log('data', data);
        setVideoUrl(data.videoUrl);
        const subtitleResponse = await fetch(data.subtitleUrl);
        const subtitleText = await subtitleResponse.text();
        setSubtitleText(subtitleText);
        // setSubtitleUrl(data.subtitleUrl);
      } catch (error) {
        console.error('Error fetching signed URLs:', error);
      }
    }

    fetchSignedUrls();
  }, []);

  const toggleSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };



  return (

    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center w-16 h-16" href="#">
          <img src="logo-Photoroom.png" alt='logo' className=" flex items-center justify-center" />
          {/* <BookOpen className="h-6 w-6" /> */}
          {/* <span className="sr-only">TeleLingua</span> */}
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-lg font-medium hover:underline underline-offset-4" href="#">
            Leaderboard
          </Link>
          <Link className="text-lg font-medium hover:underline underline-offset-4" href="./video">
            Video
          </Link>
          <Link className="text-lg font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-lg font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[#dde5b6]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Learn English with Your Favorite TV Shows
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Master English naturally and enjoyably through popular TV series. Improve your vocabulary, pronunciation, and cultural understanding.
                </p>
              </div>
              <div className="space-x-4">
                <button className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300">
                  Get Started
                </button>
                <button className="border-[#adc178] border-2 h-9 rounded-md p-2 inline-flex justify-center items-center hover:bg-[#adc178] hover:text-white">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">How It Works</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <PlayCircle className="h-12 w-12 text-gray-800 dark:text-gray-100" />
                <h3 className="text-xl font-bold">Watch TV Series Clips</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Enjoy short, engaging clips from popular TV series
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <BookOpen className="h-12 w-12 text-gray-800 dark:text-gray-100" />
                <h3 className="text-xl font-bold">Learn Vocabulary</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Master new words and phrases in context
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <MessageCircle className="h-12 w-12 text-gray-800 dark:text-gray-100" />
                <h3 className="text-xl font-bold">Practice Speaking</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Improve pronunciation with interactive exercises
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#FAF0CA]">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">What Our Learners Say</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg border">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  "I've learned so much English slang and cultural references. It's like having a native speaker as a friend!"
                </p>
                <p className="text-sm font-bold">- Sarah K., Germany</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg border">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  "The interactive quizzes really help me remember new vocabulary. Plus, it's so much fun!"
                </p>
                <p className="text-sm font-bold">- Carlos M., Brazil</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 dark:border-gray-700 p-4 rounded-lg border">
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  "I love how I can learn English while enjoying my favorite shows. It doesn't even feel like studying!"
                </p>
                <p className="text-sm font-bold">- Yuki T., Japan</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#2E2F5B] dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold text-white tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Ready to Start?</h2>
            <div className="mx-auto max-w-sm space-y-4">
              <form className="flex flex-col gap-2">
                <input placeholder="Enter your email" type="email" className="rounded-md" />
                <button type="submit">Sign Up for Free Trial</button>
              </form>
              <p className="text-xs text-center text-white dark:text-gray-400">
                No credit card required. Start learning today!
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>

  );
}
