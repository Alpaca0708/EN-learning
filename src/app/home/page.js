"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredSeries = [
    {
      id: 1,
      title: "The Last Stand",
      description: "A thrilling action movie",
      imageUrl: "/api/placeholder/240/135",
      type: "movie",
    },
    {
      id: 2,
      title: "Laugh Riot",
      description: "A hilarious comedy movie",
      imageUrl: "/api/placeholder/240/135",
      type: "movie",
    },
    {
      id: 3,
      title: "Eternal Echoes",
      description: "A touching drama movie",
      imageUrl: "/api/placeholder/240/135",
      type: "movie",
    },
  ];

  const recommendedSeries = [
    { id: 1, title: "The Final Frontier", imageUrl: "/api/placeholder/176/99" },
    { id: 2, title: "Echoes of the Past", imageUrl: "/api/placeholder/176/99" },
    { id: 3, title: "City of Dreams", imageUrl: "/api/placeholder/176/99" },
    {
      id: 4,
      title: "Whispers of the Wind",
      imageUrl: "/api/placeholder/176/99",
    },
    { id: 5, title: "Crimson Tide", imageUrl: "/api/placeholder/176/99" },
    { id: 6, title: "Starlight Serenade", imageUrl: "/api/placeholder/176/99" },
  ];

  return (
    <div className="bg-[#171212] min-h-screen">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-5 flex justify-center">
        <div className="max-w-[960px] w-full">
          {/* 主搜索栏 */}
          <div className="px-4 py-3">
            <div className="flex w-full items-center rounded-lg h-12">
              <div className="bg-[#382929] pl-4 rounded-l-lg flex items-center justify-center h-full">
                <Search className="w-6 h-6 text-[#b89e9e]" />
              </div>
              <input
                className="flex-1 bg-[#382929] text-white placeholder-[#b89e9e] px-2 pr-4 py-2 rounded-r-lg text-base h-full border-none outline-none"
                placeholder="Search for series and movies"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 精选内容 */}
          <div className="px-4 py-4">
            <div className="flex gap-3 overflow-x-auto pb-4">
              {featuredSeries.map((item) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-60 bg-gray-800 rounded-lg overflow-hidden"
                >
                  <div
                    className="h-[135px] bg-cover bg-center rounded-t-lg"
                    style={{
                      backgroundImage: `url('${item.imageUrl}')`,
                      backgroundColor: "#4a5568",
                    }}
                  />
                  <div className="p-4">
                    <h3 className="text-white text-base font-medium mb-1">
                      {item.title}
                    </h3>
                    <p className="text-[#b89e9e] text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 推荐内容标题 */}
          <div className="px-4 py-5">
            <h2 className="text-white text-[22px] font-bold leading-tight">
              Recommended for you
            </h2>
          </div>

          {/* 推荐内容网格 */}
          <div className="px-4 pb-8">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
              {recommendedSeries.map((item) => (
                <Link
                  key={item.id}
                  href={`/series/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                  className="group"
                >
                  <div className="w-44 pb-3">
                    <div
                      className="h-[99px] bg-cover bg-center rounded-lg mb-3 group-hover:opacity-80 transition-opacity"
                      style={{
                        backgroundImage: `url('${item.imageUrl}')`,
                        backgroundColor: "#4a5568",
                      }}
                    />
                    <h3 className="text-white text-base font-medium leading-6 group-hover:text-gray-300 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* 学习功能提示 */}
          <div className="px-4 py-8">
            <div className="bg-[#382929] rounded-lg p-6 text-center">
              <h3 className="text-white text-xl font-bold mb-2">
                Start Learning English Today
              </h3>
              <p className="text-[#b89e9e] mb-4">
                Watch your favorite series and movies while improving your
                English skills
              </p>
              <Link
                href="/series"
                className="inline-block bg-[#4a5568] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5a6578] transition-colors"
              >
                Browse Series
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
