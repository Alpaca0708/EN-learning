"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // 改用 NextAuth
import Link from "next/link";
import { Play, Heart, Clock, Calendar } from "lucide-react";

export default function MyListPage() {
  const { data: session, status } = useSession(); // 🔥 使用 NextAuth session
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user) {
      fetchFavorites();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [session, status]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
      } else {
        setError("無法載入收藏清單");
      }
    } catch (err) {
      setError("載入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (episodeId) => {
    try {
      const response = await fetch(`/api/favorites?episodeId=${episodeId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFavorites(
          favorites.filter((fav) => fav.episodeId._id !== episodeId)
        );
      } else {
        alert("fail to remove");
      }
    } catch (err) {
      alert("fail to remove");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          {/* <div className="text-4xl mb-4">⏳</div> */}
          <p>loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold mb-4">Please login</h1>
          <p className="text-gray-400 mb-6">
            After login, you can view your favorite lists
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchFavorites}
            className="mt-4 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
          >
            reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-8">
        <div className="max-w-6xl mx-auto">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">My Favorites</h1>
            <p className="text-gray-400">Total {favorites.length} lists</p>
          </div>

          {/* 收藏清單 */}
          {favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={64} className="mx-auto mb-4 text-gray-600" />
              <h2 className="text-2xl font-bold mb-4">No lists yet</h2>
              <p className="text-gray-400 mb-6">
                Start exploring and adding your favorite episodes to your
              </p>
              <Link
                href="/series"
                className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
              >
                Explore
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite._id}
                  favorite={favorite}
                  onRemove={removeFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// FavoriteCard 組件保持不變
function FavoriteCard({ favorite, onRemove }) {
  const episode = favorite.episodeId;
  const addedDate = new Date(favorite.addedAt).toLocaleDateString("zh-TW");

  return (
    <div className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors">
      {/* 劇集信息 */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1 line-clamp-1 overflow-hidden text-ellipsis">
              {episode.title}
            </h3>
            <p className="text-sm text-gray-400">
              Episode {episode.episodeNumber}
            </p>
          </div>

          {/* 移除收藏按鈕 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove(episode._id);
            }}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-2"
            title="移除收藏"
          >
            <Heart size={18} fill="red" className="text-red-500" />
          </button>
        </div>

        {/* 收藏時間 */}
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar size={14} className="mr-1" />
          Added on {addedDate}
        </div>

        {/* 動作按鈕 */}
        <div className="flex gap-2">
          <Link
            href={`/series/breaking-bad/1/${episode.episodeNumber}`}
            className="flex-1 bg-purple-500 hover:bg-purple-700 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
          >
            <Play size={16} />
            <span className="text-sm">Watch</span>
          </Link>

          <Link
            href={`/series/breaking-bad/1`}
            className="flex-1 bg-gray-700 hover:bg-gray-600 flex items-center justify-center gap-2 py-2 rounded-lg transition-colors"
          >
            <Clock size={16} />
            <span className="text-sm">More</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
