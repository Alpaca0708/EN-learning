"use client";

import { useState, useEffect } from "react";
import VoicePostForm from "./VoicePostForm";
import { CircleX } from "lucide-react";

// The EpisodePlayer component handles all client-side interactivity.
export default function EpisodePlayer({ episodeData }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [subtitleText, setSubtitleText] = useState("");
  const [clipIndex, setClipIndex] = useState(1); // Start with the first clip
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVoiceForm, setShowVoiceForm] = useState(false);

  const totalClips = episodeData.clipCount;

  useEffect(() => {
    // This effect runs whenever the clipIndex changes.
    if (!episodeData) return;
    console.log("episodeData::::", episodeData);

    async function fetchClip() {
      setIsLoading(true);
      setError(null);
      try {
        // Use the gcsPathPrefix from our database and append the clip number.
        const fileName = `${episodeData.gcsPathPrefix}/${clipIndex}`;

        // Your existing API for getting signed URLs.
        // NOTE: You might need to adjust this API to accept a full file path.
        const response = await fetch(`/api/get-sign-url?fileName=${fileName}`);
        // const response = await fetch(
        //   `/api/get-sign-url?season=Season_1&episode=Episode_5&fileName=3`
        // );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch signed URLs (HTTP ${response.status})`
          );
        }

        const data = await response.json();
        // console.log("data", data);
        setVideoUrl(data.videoUrl);
        // console.log("fileName", fileName);
        // console.log("videoUrl", data.videoUrl);

        // Fetch the subtitle content from the signed URL
        const subtitleResponse = await fetch(data.subtitleUrl);
        if (!subtitleResponse.ok) {
          throw new Error(
            `Failed to fetch subtitle (HTTP ${subtitleResponse.status})`
          );
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
    <div className="w-full max-w-6xl mx-auto">
      {/* Video Player Section */}
      <div className="rounded-lg mb-6">
        <div className="w-full aspect-video bg-[#1F1414] flex items-center justify-center rounded-lg shadow-lg overflow-hidden border border-[#40292B]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center text-[#FFFFFF]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E8B5B8] mb-4"></div>
              <p className="text-lg">Loading clip...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-[#E8B5B8]">
              <p className="text-lg font-semibold mb-2">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <video
              controls
              autoPlay
              key={videoUrl}
              className="w-full h-full rounded-lg"
              src={videoUrl}
              playsInline
              webkit-playsinline="true"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[#FFFFFF] text-lg font-semibold">
              Clip {clipIndex} / {totalClips}
            </p>
            <div className="w-32 bg-[#2a1f1f] rounded-full h-2 border border-[#40292B]">
              <div
                className="bg-[#E8B5B8] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(clipIndex / totalClips) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="px-6 py-3 text-[#1F1414] font-bold bg-[#E8B5B8] rounded-lg disabled:bg-[#b89e9e] disabled:cursor-not-allowed hover:bg-[#d4a5a8] transition-colors duration-200 flex items-center gap-2"
              onClick={handlePreviousClip}
              disabled={clipIndex === 1 || isLoading}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Prev
            </button>
            <button
              className="px-6 py-3 text-[#1F1414] font-bold bg-[#E8B5B8] rounded-lg disabled:bg-[#b89e9e] disabled:cursor-not-allowed hover:bg-[#d4a5a8] transition-colors duration-200 flex items-center gap-2"
              onClick={handleNextClip}
              disabled={clipIndex === totalClips || isLoading}
            >
              Next
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Subtitles Section */}
      <div className="bg-[#2a1f1f] border border-[#40292B] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex w-full">
            <div className="w-8 h-8 bg-[#E8B5B8] rounded-full flex items-center justify-center mr-2">
              <svg
                className="w-4 h-4 text-[#1F1414]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-[#FFFFFF] text-xl font-bold">Subtitles</h3>
          </div>
          <button
            className="px-4 py-2 bg-[#E8B5B8] text-xl font-semibold text-[#FFFFFF] rounded-lg hover:bg-[#4a2f31] transition-colors duration-200"
            onClick={() => setShowVoiceForm(true)}
          >
            Shadowing
          </button>
        </div>

        {showVoiceForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-[#1F1414] rounded-2xl p-8 shadow-xl max-w-lg w-full relative">
              <button
                onClick={() => setShowVoiceForm(false)}
                className="absolute top-3 right-3 text-[#E8B5B8] hover:text-white text-2xl"
              >
                <CircleX size={24} />
              </button>
              <VoicePostForm
                targetText={subtitleText}
                onClose={() => setShowVoiceForm(false)}
              />
            </div>
          </div>
        )}

        <div className="bg-[#1F1414] border border-[#40292B] rounded-lg p-4 min-h-[200px]">
          <div className="text-[#FFFFFF] whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {isLoading ? (
              <div className="flex items-center gap-2 text-[#b89e9e]">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#E8B5B8]"></div>
                Loading subtitles...
              </div>
            ) : subtitleText ? (
              subtitleText
            ) : (
              <p className="text-[#b89e9e] italic">
                No subtitles available for this clip.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
