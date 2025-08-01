"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Trash2,
  Volume2,
  Mic,
} from "lucide-react";
import { useSession } from "next-auth/react";
import VoiceReply from "./VoiceReply";
import VoiceReplyForm from "./VoiceReplyForm";

const VoicePostCard = ({ post, onDelete, onLike, onReply }) => {
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
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

  const isLiked = post.likes?.includes(session?.user?.id);
  const isOwnPost = post.userId === session?.user?.id;

  const handleReplyLike = (replyId) => {
    // 处理回复点赞逻辑
    console.log("Like reply:", replyId);
  };

  const handleReplyDelete = (replyId) => {
    // 处理回复删除逻辑
    console.log("Delete reply:", replyId);
  };

  const handleReplySubmit = (newReply) => {
    // 处理新回复提交
    console.log("New reply:", newReply);
    setShowReplyForm(false);
    // 这里可以调用父组件的回调来更新帖子数据
  };

  const handleReplyCancel = () => {
    setShowReplyForm(false);
  };

  return (
    <div className="bg-[#1F1414] border border-[#40292B] rounded-xl p-6 mb-6">
      {/* 用户信息头部 */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            {post.user?.image ? (
              <img
                src={post.user.image}
                alt={post.user.name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#E8B5B8] flex items-center justify-center">
                <span className="text-[#1F1414] font-bold text-lg">
                  {post.user?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-[#FFFFFF] font-semibold text-lg">
              {post.user?.name || "Anonymous"}
            </h3>
            <p className="text-[#b89e9e] text-sm">
              {new Date(post.createdAt).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* 菜单按钮 */}
        {isOwnPost && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-[#b89e9e] hover:text-[#FFFFFF] p-2 rounded-lg hover:bg-[#40292B] transition-colors"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-10 bg-[#2a1f1f] border border-[#4a3a3a] rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onDelete(post._id);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-[#40292B] w-full text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 音频播放器 */}
      <div className="bg-[#40292B] rounded-xl p-4 mb-4 border border-[#4a3a3a]">
        <audio
          ref={audioRef}
          src={post.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* 自定义播放器 */}
        <div className="bg-[#1F1414] rounded-lg p-4">
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
                  {post.title || "Voice Post"}
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

      {/* 互动按钮 */}
      <div className="flex items-center gap-6 text-sm">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-2 hover:text-[#E8B5B8] transition-colors ${
            isLiked ? "text-[#E8B5B8]" : "text-[#b89e9e]"
          }`}
        >
          <Heart size={16} className={isLiked ? "fill-current" : ""} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="flex items-center gap-2 text-[#b89e9e] hover:text-[#E8B5B8] transition-colors"
        >
          <MessageCircle size={16} />
          <span>{post.replies?.length || 0}</span>
        </button>

        <button className="flex items-center gap-2 text-[#b89e9e] hover:text-[#E8B5B8] transition-colors">
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>

      {/* 回复表单 */}
      {showReplyForm && (
        <VoiceReplyForm
          postId={post._id}
          onReply={handleReplySubmit}
          onCancel={handleReplyCancel}
        />
      )}

      {/* 回复区域 */}
      {post.replies && post.replies.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#40292B]">
          <h4 className="text-[#FFFFFF] font-medium mb-3">
            Replies ({post.replies.length})
          </h4>
          <div className="space-y-3">
            {(showAllReplies ? post.replies : post.replies.slice(0, 3)).map(
              (reply) => (
                <VoiceReply
                  key={reply._id}
                  reply={reply}
                  onDelete={handleReplyDelete}
                  onLike={handleReplyLike}
                />
              )
            )}
            {post.replies.length > 3 && (
              <button
                onClick={() => setShowAllReplies(!showAllReplies)}
                className="text-[#E8B5B8] text-sm hover:text-[#d4a5a8] transition-colors"
              >
                {showAllReplies
                  ? "Show less"
                  : `View all ${post.replies.length} replies`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoicePostCard;
