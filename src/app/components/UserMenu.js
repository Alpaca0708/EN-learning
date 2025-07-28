"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogOut, Settings, BookOpen } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 點擊外部關閉選單
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (status === "loading") {
    return (
      <div className="w-8 h-8 bg-[#2a1f1f] rounded-full animate-pulse"></div>
    );
  }

  if (!session) {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-2 px-4 py-2 bg-[#A97CD1] hover:bg-[#799CAA] text-white rounded-lg font-medium transition-colors duration-300"
      >
        <User className="w-4 h-4" />
        Sign In
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* 用戶頭像按鈕 */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 rounded-full hover:bg-[#2a1f1f] transition-colors duration-300"
      >
        <img
          src={session.user.image}
          alt={session.user.name}
          className="w-12 h-12 rounded-full"
        />
      </button>

      {/* 下拉選單 */}
      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-[#2a1f1f] border border-[#4a3a3a] rounded-lg shadow-lg py-2 z-50">
          {/* 用戶資訊 */}
          <div className="px-4 py-3 border-b border-[#4a3a3a]">
            <div className="flex items-center gap-3">
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-white font-medium">{session.user.name}</p>
                <p className="text-[#b89e9e] text-sm">{session.user.email}</p>
                <p className="text-purple-400 text-xs capitalize">
                  {session.user.subscription || "free"} plan
                </p>
              </div>
            </div>
          </div>

          {/* 統計資訊 */}
          <div className="px-4 py-3 border-b border-[#4a3a3a]">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <p className="text-cyan-400 font-medium">
                  {session.user.totalNotes || 0}
                </p>
                <p className="text-[#b89e9e]">Notes</p>
              </div>
              <div className="text-center">
                <p className="text-orange-400 font-medium">
                  {Math.floor((session.user.totalWatchTime || 0) / 60)}h
                </p>
                <p className="text-[#b89e9e]">Watched</p>
              </div>
            </div>
          </div>

          {/* 選單項目 */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                // TODO: 導航到個人資料頁面
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[#b89e9e] hover:text-white hover:bg-[#382929] transition-colors duration-200"
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                // TODO: 導航到我的筆記頁面
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[#b89e9e] hover:text-white hover:bg-[#382929] transition-colors duration-200"
            >
              <BookOpen className="w-4 h-4" />
              My List
            </button>

            <button
              onClick={() => {
                setIsMenuOpen(false);
                // TODO: 導航到設定頁面
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-[#b89e9e] hover:text-white hover:bg-[#382929] transition-colors duration-200"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>

          {/* 登出 */}
          <div className="border-t border-[#4a3a3a] pt-1">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-[#382929] transition-colors duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
