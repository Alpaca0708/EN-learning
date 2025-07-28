"use client";

import { useState, useEffect } from "react";
import { Heart, Loader } from "lucide-react";

export default function FavoriteButton({ episodeId }) {
  const [user, setUser] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isCheckingFavorite, setIsCheckingFavorite] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  // 🆕 當 user 和 episodeId 都存在時，檢查收藏狀態
  useEffect(() => {
    if (user && episodeId) {
      checkIfFavorited();
    }
  }, [user, episodeId]);

  const checkUserSession = async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("check session failed:", error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // 🆕 檢查當前 episode 是否已收藏
  const checkIfFavorited = async () => {
    setIsCheckingFavorite(true);
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        const favorites = data.favorites || [];

        // 檢查當前 episodeId 是否在收藏列表中
        const isFav = favorites.some((fav) => fav.episodeId._id === episodeId);
        setIsFavorited(isFav);
      }
    } catch (error) {
      console.error("check favorite failed:", error);
    } finally {
      setIsCheckingFavorite(false);
    }
  };

  if (isCheckingSession || isCheckingFavorite) {
    return (
      <div className="flex items-center gap-2 p-2 text-white rounded-lg">
        <span className="text-lg">
          <Loader size={22} className="animate-spin" />
        </span>
        {/* <span className="text-sm">Loading...</span> */}
      </div>
    );
  }

  if (!user) {
    return (
      <button
        onClick={(e) => {
          alert("please login to add to favorites");
        }}
        className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200"
      >
        <span className="text-lg">♡</span>
        {/* <span className="text-sm">Add to Favorites</span> */}
      </button>
    );
  }

  const handleToggleFavorite = async (e) => {
    setIsLoading(true);

    // console.log("📝 準備執行收藏操作，當前狀態:", {
    //   isFavorited,
    //   episodeId,
    //   user: user?.email,
    // });

    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites?episodeId=${episodeId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsFavorited(false);
        } else {
          console.error("remove fail:", response.status);
        }
      } else {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ episodeId }),
        });

        if (response.ok) {
          setIsFavorited(true);
        } else {
          console.error("fail to add:", response.status);
        }
      }
    } catch (error) {
      alert("fail, please try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="p-2 rounded-lg transition-all duration-200 hover:bg-gray-700"
    >
      <span className="text-lg">
        {isLoading ? (
          <Loader size={22} className="animate-spin" />
        ) : isFavorited ? (
          <Heart strokeWidth={0} size={22} fill="red" />
        ) : (
          <Heart size={20} className="text-gray-400 hover:text-red-400" />
        )}
      </span>
      {/* <span className="text-sm">
        {isLoading
          ? "Loading..."
          : isFavorited
            ? "In Favorites"
            : "Add to Favorites"}
      </span> */}
    </button>
  );
}
