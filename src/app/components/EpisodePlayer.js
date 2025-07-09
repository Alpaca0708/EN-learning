
'use client';

import { useState, useEffect } from 'react';

// The EpisodePlayer component handles all client-side interactivity.
export default function EpisodePlayer({ episodeData }) {
  const [videoUrl, setVideoUrl] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const [clipIndex, setClipIndex] = useState(1); // Start with the first clip
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const totalClips = episodeData.clipCount;

  useEffect(() => {
    // This effect runs whenever the clipIndex changes.
    if (!episodeData) return;

    async function fetchClip() {
      setIsLoading(true);
      setError(null);
      try {
        // Use the gcsPathPrefix from our database and append the clip number.
        const fileName = `${episodeData.gcsPathPrefix}/clip-${clipIndex}`;
        
        // Your existing API for getting signed URLs.
        // NOTE: You might need to adjust this API to accept a full file path.
        const response = await fetch(`/api/get-sign-url?fileName=${fileName}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch signed URLs (HTTP ${response.status})`);
        }
        
        const data = await response.json();
        setVideoUrl(data.videoUrl);

        // Fetch the subtitle content from the signed URL
        const subtitleResponse = await fetch(data.subtitleUrl);
        if (!subtitleResponse.ok) {
          throw new Error(`Failed to fetch subtitle (HTTP ${subtitleResponse.status})`);
        }
        const subtitles = await subtitleResponse.text();
        setSubtitleText(subtitles);

      } catch (err) {
        console.error("Error fetching clip data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClip();
  }, [clipIndex, episodeData]); // Re-run when clipIndex or the initial episodeData changes

  const handlePreviousClip = () => {
    if (clipIndex > 1) {
      setClipIndex(clipIndex - 1);
    }
  };

  const handleNextClip = () => {
    if (clipIndex < totalClips) {
      setClipIndex(clipIndex + 1);
    }
  };

  return (
    <div className='flex flex-col p-4 bg-white w-full items-center'>
      <main className='border-[#d5bdaf] border-2 p-3 rounded-md flex flex-col items-center w-full md:w-3/4 lg:w-1/2'>
        <div className="w-full aspect-video bg-black flex items-center justify-center rounded-lg shadow-lg">
          {isLoading ? (
            <p className="text-white">Loading clip...</p>
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : (
            <video controls autoPlay key={videoUrl} className="w-full h-full rounded-lg" src={videoUrl}>
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className='w-full flex justify-between items-center py-4'>
          <p className="text-lg font-semibold">Clip {clipIndex} / {totalClips}</p>
          <div className='flex justify-end my-1 space-x-4'>
            <button 
              className='text-white font-bold bg-[#6c584c] p-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed'
              onClick={handlePreviousClip}
              disabled={clipIndex === 1 || isLoading}
            >
              Previous Clip
            </button>
            <button 
              className='text-white font-bold bg-[#6c584c] p-2 rounded-md disabled:bg-gray-500 disabled:cursor-not-allowed'
              onClick={handleNextClip}
              disabled={clipIndex === totalClips || isLoading}
            >
              Next Clip
            </button>
          </div>
        </div>
      </main>

      <div className='w-full md:w-3/4 lg:w-1/2 mt-4 bg-[#d4a373] p-4 rounded-md text-white'>
        <h3 className="text-xl font-bold border-b-2 border-[#edede9] pb-2 mb-2">Subtitles</h3>
        <div className='text-black whitespace-pre-wrap font-mono'>
          {isLoading ? 'Loading subtitles...' : subtitleText}
        </div>
      </div>
    </div>
  );
}
