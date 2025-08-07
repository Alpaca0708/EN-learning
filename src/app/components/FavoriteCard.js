import { Play, Heart, Clock, Calendar } from "lucide-react";
import Link from "next/link";

export default function FavoriteCard({ favorite, onRemove }) {
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
