"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  MoreVertical,
  Trash2,
  Volume2,
  Mic,
  Send,
} from "lucide-react";
import { useSession } from "next-auth/react";

const VoiceReply = ({ reply, onDelete, onLike, isNested = false }) => {
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const audioRef = useRef(null);

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

  const isLiked = reply.likes?.includes(session?.user?.id);
  const isOwnReply = reply.userId === session?.user?.id;

  return (
    <div
      className={`bg-[#2a1f1f] rounded-lg p-4 ${isNested ? "ml-4 border-l-2 border-[#40292B]" : ""}`}
    >
      {/* 用户信息 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {reply.user?.image ? (
              <img
                src={reply.user.image}
                alt={reply.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#E8B5B8] flex items-center justify-center">
                <span className="text-[#1F1414] font-bold text-sm">
                  {reply.user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <span className="text-[#FFFFFF] text-sm font-medium">
              {reply.user?.name || "Anonymous"}
            </span>
            <span className="text-[#b89e9e] text-xs ml-2">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* 菜单按钮 */}
        {isOwnReply && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-[#b89e9e] hover:text-[#FFFFFF] p-1 rounded transition-colors"
            >
              <MoreVertical size={14} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-6 bg-[#1F1414] border border-[#4a3a3a] rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                <button
                  onClick={() => {
                    onDelete(reply._id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1 hover:bg-[#40292B] w-full text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 文本内容 */}
      {reply.text && (
        <div className="text-[#FFFFFF] text-sm mb-3">{reply.text}</div>
      )}

      {/* 音频播放器（如果有音频） */}
      {reply.audioUrl && (
        <div className="bg-[#40292B] rounded-lg p-3 mb-3 border border-[#4a3a3a]">
          <audio
            ref={audioRef}
            src={reply.audioUrl}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* 自定义播放器 */}
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

      {/* 互动按钮 */}
      <div className="flex items-center gap-4 text-xs">
        <button
          onClick={() => onLike(reply._id)}
          className={`flex items-center gap-1 hover:text-[#E8B5B8] transition-colors ${
            isLiked ? "text-[#E8B5B8]" : "text-[#b89e9e]"
          }`}
        >
          <Heart size={12} className={isLiked ? "fill-current" : ""} />
          <span>{reply.likes?.length || 0}</span>
        </button>

        <button className="flex items-center gap-1 text-[#b89e9e] hover:text-[#E8B5B8] transition-colors">
          <MessageCircle size={12} />
          <span>Reply</span>
        </button>
      </div>
    </div>
  );
};

export default VoiceReply;
