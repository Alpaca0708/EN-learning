"use client";

import React, { useState, useRef } from "react";
import { Play, Pause, Mic, MicOff, Send, Volume2 } from "lucide-react";
import { useSession } from "next-auth/react";

const VoiceReplyForm = ({ postId, onReply, onCancel }) => {
  const { data: session } = useSession();
  const [status, setStatus] = useState("idle");
  const [audioUrl, setAudioUrl] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef();
  const audioRef = useRef(null);

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
      setError("無法啟用麥克風，請檢查瀏覽器權限。");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleSend = async () => {
    if (!audioBlob && !text.trim()) {
      setError("請輸入文字或錄製語音");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const formData = new FormData();
      if (audioBlob) {
        formData.append("audio", audioBlob, "reply.webm");
      }
      formData.append("text", text);
      formData.append("postId", postId);

      const response = await fetch("/api/voice-replies", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("發送失敗");
      }

      const result = await response.json();
      onReply(result.reply);
      handleReset();
    } catch (err) {
      setError("發送失敗，請重試");
      setStatus("preview");
    }
  };

  const handleReset = () => {
    setAudioUrl("");
    setAudioBlob(null);
    setText("");
    setStatus("idle");
    setError("");
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-[#2a1f1f] border border-[#40292B] rounded-lg p-4 mt-3">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-[#E8B5B8] flex items-center justify-center">
              <span className="text-[#1F1414] font-bold text-sm">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="寫下你的回覆..."
            className="w-full bg-[#1F1414] border border-[#40292B] rounded-lg p-3 text-[#FFFFFF] placeholder-[#b89e9e] resize-none focus:outline-none focus:border-[#E8B5B8] transition-colors"
            rows={3}
          />
        </div>
      </div>

      {/* 录音状态 */}
      {status === "idle" && (
        <div className="flex items-center gap-3">
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-3 py-2 bg-[#E8B5B8] text-[#1F1414] rounded-lg hover:bg-[#d4a5a8] transition-colors text-sm font-medium"
          >
            <Mic size={16} />
            Record Voice
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 text-[#b89e9e] hover:text-[#FFFFFF] transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {status === "recording" && (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[#E8B5B8] animate-pulse">
            <Mic size={16} />
            <span className="text-sm font-medium">Recording...</span>
          </div>
          <button
            onClick={stopRecording}
            className="px-3 py-2 bg-[#40292B] text-[#FFFFFF] rounded-lg hover:bg-[#4a2f31] transition-colors text-sm"
          >
            Stop
          </button>
        </div>
      )}

      {status === "preview" && (
        <div className="space-y-3">
          {/* 音频预览 */}
          {audioUrl && (
            <div className="bg-[#40292B] rounded-lg p-3 border border-[#4a3a3a]">
              <audio
                ref={audioRef}
                src={audioUrl}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />

              <div className="bg-[#1F1414] rounded-lg p-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayPause}
                    className="w-10 h-10 bg-[#E8B5B8] rounded-full flex items-center justify-center hover:bg-[#d4a5a8] transition-colors"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 text-[#1F1414]" />
                    ) : (
                      <Play className="w-4 h-4 text-[#1F1414] ml-0.5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Volume2 className="w-3 h-3 text-[#E8B5B8]" />
                      <span className="text-[#FFFFFF] text-xs font-medium">
                        Voice Reply
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#b89e9e]">
                      <span>{formatTime(currentTime)}</span>
                      <div className="flex-1 relative">
                        <div
                          className="w-full h-0.5 bg-[#40292B] rounded-full cursor-pointer"
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
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSend}
              disabled={status === "sending"}
              className="flex items-center gap-2 px-4 py-2 bg-[#E8B5B8] text-[#1F1414] rounded-lg hover:bg-[#d4a5a8] transition-colors text-sm font-medium disabled:opacity-50"
            >
              <Send size={16} />
              {status === "sending" ? "Sending..." : "Send Reply"}
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 text-[#b89e9e] hover:text-[#FFFFFF] transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-2 text-[#b89e9e] hover:text-[#FFFFFF] transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {status === "sending" && (
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#E8B5B8] rounded-full border-t-transparent animate-spin"></div>
          <span className="text-[#E8B5B8] text-sm">Sending reply...</span>
        </div>
      )}

      {error && (
        <div className="text-[#E8B5B8] bg-[#40292B] px-3 py-2 rounded-lg text-sm mt-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceReplyForm;
