'use client'
import Image from "next/image";
import './globals.css';
import { useEffect, useState } from "react";

export default function Home() {

  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [showSubtitles, setShowSubtitles] = useState(false);



  // useEffect(() => {
  //   async function fetchSignedUrl() {
  //     const response = await fetch('/api/generate-sign-url');
  //     const data = await response.json();
  //     setSignedUrl(data.url);
  //   }

  //   fetchSignedUrl();
  // }, []);

  // useEffect(() => {
  //   async function fetchSignedUrls() {
  //     try {
  //       const videoResponse = await fetch(`/api/get-sign-url?fileName=breaking_bad/Season_1/Episode_1/1.mp4`);
  //       const videoData = await videoResponse.json();
  //       // console.log('videoData', videoData);
  //       setVideoUrl(videoData.url);

  //       const subtitleResponse = await fetch(`/api/get-sign-url?fileName=breaking_bad/Season_1/Episode_1/1.txt`);
  //       const subtitleData = await subtitleResponse.json();
  //       console.log('subtitleData', subtitleData);
  //       setSubtitleUrl(subtitleData.url);
  //     } catch (error) {
  //       console.error('Error fetching signed URLs:', error);
  //     }
  //   }

  //   fetchSignedUrls();
  // }, []);

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
    <div>

      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Enhance Listening</div>
        <nav className="space-x-4">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Features</a>
          <a href="#" className="hover:underline">Contact</a>
          <a href="#" className="hover:underline">Sign In</a>
        </nav>
      </header>

      <main className="text-center py-16 bg-cover bg-center" style={{ backgroundImage: "url('https://images.pexels.com/photos/17485743/pexels-photo-17485743.png?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}>
        <h1 className="text-4xl font-bold text-white">Improvement your English listening</h1>
        <p className="text-xl text-gray-200 mt-4">Breaking Bad Series: Shortcuts to Enhance Your Listening Skills </p>
        <button className="mt-8 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">開始學習</button>
      </main>

      {/* <section className="py-16 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-8">我們的特色</h2>
        <div className="flex justify-around max-w-4xl mx-auto space-x-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">用AI技術智能分析影片片段，針對中階英文能力學習者，提升學習效果</div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">強化聽力訓練與理解能力</div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">適用強化聽力的學習者，以及breaking bad crazy fans</div>
        </div>
      </section> */}

      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-8">Breaking Bad Series</h2>
        <div className="inline-block w-2/5">
          {videoUrl && (
            <video controls className="w-full rounded-lg shadow-lg">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {/* <div className="mt-4 bg-black text-white p-4 rounded-lg">
            {subtitleText && (
              <p>{subtitleText}</p>
            )}
          </div> */}
          <button
            className="mt-4 bg-blue-500 text-white p-2 rounded-lg"
            onClick={toggleSubtitles}
          >
            {showSubtitles ? 'Hide Subtitles' : 'Show Subtitles'}
          </button>

          {showSubtitles && (
            <div className="mt-4 bg-black text-white p-4 rounded-lg">
              {subtitleText.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>© 2024 copyright</p>
        <div className="space-x-4">
          {/* <a href="#" className="hover:underline">隱私政策</a>
          <a href="#" className="hover:underline">使用條款</a>
          <a href="#" className="hover:underline">聯絡我們</a> */}
        </div>
      </footer>
    </div>
  );
}
