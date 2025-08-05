"use client";

import { Mic, MicOff, Play, Pause, Send, Volume2 } from "lucide-react";

import { useSession } from "next-auth/react";

import React, { useState, useRef, useMemo, useEffect } from "react";

const VoicePostForm = ({ targetText = "", onClose }) => {
  const { data: session } = useSession();
  const [status, setStatus] = useState("idle");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [aiAudioUrl, setAiAudioUrl] = useState("");
  const [aiText, setAiText] = useState("");
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAiPlaying, setIsAiPlaying] = useState(false);
  const [aiCurrentTime, setAiCurrentTime] = useState(0);
  const [aiDuration, setAiDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef();
  const audioRef = useRef(null);
  const aiAudioRef = useRef(null);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
        setAudioUrl(URL.createObjectURL(audioBlob));
        setStatus("preview");
      };
      mediaRecorder.start();
      setStatus("recording");
    } catch (err) {
      setError("fail to get permission");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleSend = async () => {
    if (!audioBlob) return;
    setStatus("sending");
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");
      if (targetText) {
        formData.append("targetText", targetText);
      }
      const resp = await fetch("/api/voice-to-ai", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!resp.ok) throw new Error("fail to send");
      const result = await resp.json();
      setAiText(result.text);
      setAiAudioUrl(result.audioUrl);
      setStatus("done");
    } catch (err) {
      setError("Fail to send");
      setStatus("preview");
    }
  };

  useEffect(() => {
    if (aiText) {
      console.log("aiText::::", aiText);
    }
  }, [audioUrl]);

  const handleReset = () => {
    setAudioUrl("");
    setAudioBlob(null);
    setAiText("");
    setAiAudioUrl("");
    setStatus("idle");
    setError("");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsAiPlaying(false);
    setAiCurrentTime(0);
    setAiDuration(0);
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * duration;

    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const toggleAiPlayPause = () => {
    if (aiAudioRef.current) {
      if (isAiPlaying) {
        aiAudioRef.current.pause();
      } else {
        aiAudioRef.current.play();
      }
      setIsAiPlaying(!isAiPlaying);
    }
  };

  const handleAiTimeUpdate = () => {
    if (aiAudioRef.current) {
      setAiCurrentTime(aiAudioRef.current.currentTime);
    }
  };

  const handleAiLoadedMetadata = () => {
    if (aiAudioRef.current) {
      setAiDuration(aiAudioRef.current.duration);
    }
  };

  const handleAiSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const seekTime = (clickX / width) * aiDuration;

    if (aiAudioRef.current) {
      aiAudioRef.current.currentTime = seekTime;
      setAiCurrentTime(seekTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const feedback = useMemo(() => {
    if (!aiText) return null;
    try {
      return JSON.parse(aiText);
    } catch (e) {
      // 容錯: 有時 GPT 會多包解釋/其他字串
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }, [aiText]);

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-lg flex flex-col items-center gap-6 bg-[#1F1414] border border-[#40292B]">
      {status === "idle" && (
        <>
          <div className="text-center">
            <div
              className="w-16 h-16 bg-[#E8B5B8] rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-[#d4a5a8] transition-colors cursor-pointer overflow-hidden"
              onClick={startRecording}
            >
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <Mic className="w-8 h-8 text-[#1F1414]" />
              )}
            </div>
            <h3 className="text-[#FFFFFF] text-lg font-semibold mb-2">
              Start Recording
            </h3>
            {/* <p className="text-[#E8B5B8] text-sm">點擊麥克風開始錄製您的語音</p> */}
          </div>
          <button
            className="px-6 py-3 rounded-xl bg-[#E8B5B8] text-[#1F1414] font-semibold hover:bg-[#d4a5a8] transition-all duration-200 shadow-lg"
            onClick={startRecording}
          >
            <Mic size={20} />
          </button>
          {error && (
            <div className="text-[#E8B5B8] bg-[#40292B] px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}
        </>
      )}

      {status === "recording" && (
        <>
          <div className="text-center">
            <div className="w-16 h-16 bg-[#E8B5B8] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-2xl">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Mic className="w-8 h-8 text-[#1F1414]" />
                )}
              </span>
            </div>
            <div className="text-[#E8B5B8] text-xl font-bold animate-pulse mb-2">
              Recording...
            </div>
            {/* <p className="text-[#FFFFFF] text-sm">Recording</p> */}
          </div>
          <button
            className="px-6 py-3 rounded-xl bg-[#40292B] text-[#FFFFFF] font-semibold hover:bg-[#4a2f31] transition-all duration-200 shadow-lg"
            onClick={stopRecording}
          >
            <MicOff size={20} />
          </button>
        </>
      )}

      {status === "preview" && (
        <>
          <div className="w-full">
            <h3 className="text-[#FFFFFF] text-lg font-semibold mb-4 text-center">
              Preview Recording
            </h3>
            <div className="bg-[#40292B] rounded-xl mb-4 border border-[#E8B5B8]">
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              {/* 自定义播放器 */}
              <div className="rounded-lg p-4">
                <div className="flex items-center gap-4 mb-3">
                  <button
                    onClick={togglePlayPause}
                    className="w-12 h-12 bg-[#E8B5B8] rounded-full flex items-center justify-center hover:bg-[#d4a5a8] transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-[#1F1414]" />
                    ) : (
                      <Play className="w-5 h-5 text-[#1F1414] ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="w-4 h-4 text-[#E8B5B8]" />
                      <span className="text-[#FFFFFF] text-sm font-medium">
                        Your Recording
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#b89e9e]">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1 relative">
                        <div
                          className="w-full h-1 bg-[#40292B] rounded-full cursor-pointer"
                          onClick={handleSeek}
                        >
                          <div
                            className="h-full bg-[#E8B5B8] rounded-full transition-all duration-100"
                            style={{
                              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-[#40292B] text-[#FFFFFF] rounded-lg hover:bg-[#4a2f31] transition-all duration-200 font-medium"
                onClick={handleReset}
              >
                <Mic size={20} />
              </button>
              <button
                className="px-4 py-2 bg-[#E8B5B8] text-[#1F1414] rounded-lg hover:bg-[#d4a5a8] transition-all duration-200 font-medium"
                onClick={handleSend}
              >
                <Send />
              </button>
            </div>
            {error && (
              <div className="text-[#E8B5B8] bg-[#40292B] px-4 py-2 rounded-lg text-sm mt-3">
                {error}
              </div>
            )}
          </div>
        </>
      )}

      {status === "sending" && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#E8B5B8] rounded-full border-t-transparent animate-spin mb-4"></div>
          <div className="text-[#E8B5B8] text-lg font-semibold mb-2">
            processing...
          </div>
          <div className="text-[#FFFFFF] text-sm text-center">
            waiting for AI reply...
          </div>
        </div>
      )}

      {status === "done" && (
        <>
          <div className="w-full">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-[#E8B5B8] rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-xl">🐰</span>
              </div>
              <h3 className="text-[#FFFFFF] text-lg font-semibold">
                AI reply :
              </h3>
            </div>

            <div className="bg-[#40292B] rounded-xl p-4 mb-4">
              <div className="text-[#E8B5B8] font-semibold mb-2">
                AI speak：
              </div>
              <div className="bg-[#1F1414] rounded-lg text-[#FFFFFF] text-sm">
                {feedback ? (
                  <div className="space-y-3 bg-[#222] p-4 rounded-xl">
                    <div>
                      <strong>Score:</strong>
                      <div className="text-white">{feedback.score ?? "-"}</div>
                    </div>
                    <div>
                      <strong>Suggestion:</strong>
                      <div className="text-white">{feedback.suggestion}</div>
                    </div>
                    {/* <div>
                      <strong>IELTS Tip:</strong>
                      <div className="text-white">{feedback.comment}</div>
                    </div> */}
                  </div>
                ) : (
                  // fallback 如果沒成功 parse 或 GPT 回傳格式錯誤
                  <div className="text-red-400 whitespace-pre-wrap">
                    {aiText}
                  </div>
                )}
              </div>
            </div>

            {aiAudioUrl && (
              <div className="bg-[#40292B] rounded-xl p-4 mb-4">
                <div className="text-[#E8B5B8] font-semibold mb-2">
                  AI 語音：
                </div>
                <audio
                  ref={aiAudioRef}
                  src={aiAudioUrl}
                  onTimeUpdate={handleAiTimeUpdate}
                  onLoadedMetadata={handleAiLoadedMetadata}
                  onEnded={() => setIsAiPlaying(false)}
                  className="hidden"
                />

                {/* AI 自定义播放器 */}
                <div className="bg-[#1F1414] rounded-lg p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={toggleAiPlayPause}
                      className="w-12 h-12 bg-[#E8B5B8] rounded-full flex items-center justify-center hover:bg-[#d4a5a8] transition-colors"
                    >
                      {isAiPlaying ? (
                        <Pause className="w-5 h-5 text-[#1F1414]" />
                      ) : (
                        <Play className="w-5 h-5 text-[#1F1414] ml-0.5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-4 h-4 text-[#E8B5B8]" />
                        <span className="text-[#FFFFFF] text-sm font-medium">
                          AI Response
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#b89e9e]">
                        <span>{formatTime(aiCurrentTime)}</span>
                        <div className="flex-1 relative">
                          <div
                            className="w-full h-1 bg-[#40292B] rounded-full cursor-pointer"
                            onClick={handleAiSeek}
                          >
                            <div
                              className="h-full bg-[#E8B5B8] rounded-full transition-all duration-100"
                              style={{
                                width: `${aiDuration ? (aiCurrentTime / aiDuration) * 100 : 0}%`,
                              }}
                            />
                          </div>
                        </div>
                        <span>{formatTime(aiDuration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                className="px-6 py-3 bg-[#E8B5B8] text-[#1F1414] rounded-xl hover:bg-[#d4a5a8] transition-all duration-200 font-semibold shadow-lg"
                onClick={handleReset}
              >
                New Post
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VoicePostForm;
