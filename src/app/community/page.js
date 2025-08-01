"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Mic } from "lucide-react";
import VoicePostForm from "@/app/components/VoicePostForm";
import VoicePostCard from "@/app/components/VoicePostCard";

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // if (session?.user) {
    //   fetchPosts();
    // } else if (status === "unauthenticated") {
    //   setLoading(false);
    // }
    setLoading(false);
  }, [session, status]);

  //   const fetchPosts = async () => {
  //     try {
  //       const response = await fetch("/api/voice-posts");
  //       if (response.ok) {
  //         const data = await response.json();
  //         setPosts(data.posts || []);
  //       }
  //     } catch (err) {
  //       console.error("載入貼文失敗:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   const handlePostSubmit = async (postData) => {
  //     try {
  //       const response = await fetch("/api/voice-posts", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(postData),
  //       });

  //       if (response.ok) {
  //         const newPost = await response.json();
  //         setPosts([newPost, ...posts]);
  //         setShowPostForm(false);
  //       } else {
  //         alert("發布失敗，請稍後再試");
  //       }
  //     } catch (err) {
  //       console.error("發布失敗:", err);
  //       alert("發布失敗，請稍後再試");
  //     }
  //   };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Mic size={64} className="mx-auto mb-4 text-gray-600" />
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-400 mb-6">
            Login to join the voice community
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

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-4 sm:px-10 md:px-20 lg:px-40 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 頁面標題 */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Voice Community</h1>
            <p className="text-gray-400">Practice English with voice posts</p>
          </div>

          {/* 發布按鈕 */}
          <div className="mb-8">
            <button
              onClick={() => setShowPostForm(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Mic size={20} />
              Create Voice Post
            </button>
          </div>

          {/* 語音發布表單 */}
          {showPostForm && (
            <VoicePostForm
              onClose={() => setShowPostForm(false)}
              //   onSubmit={handlePostSubmit}
            />
          )}

          {/* 語音貼文列表 */}
          <div className="space-y-6">
            {posts.length === 0
              ? //   <div className="text-center py-16">
                //     <Mic size={64} className="mx-auto mb-4 text-gray-600" />
                //     <h2 className="text-2xl font-bold mb-4">No posts yet</h2>
                //     <p className="text-gray-400 mb-6">
                //       Be the first to share your voice!
                //     </p>
                //     <button
                //       onClick={() => setShowPostForm(true)}
                //       className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
                //     >
                //       Create First Post
                //     </button>
                //   </div>
                null
              : posts.map((post) => (
                  <VoicePostCard
                    key={post._id}
                    post={post}
                    onDelete={() => {
                      setPosts(posts.filter((p) => p._id !== post._id));
                    }}
                  />
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
