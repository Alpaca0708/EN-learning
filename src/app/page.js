"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, BookOpen, Users, Star, ArrowRight } from "lucide-react";
import { useSession, signIn } from "next-auth/react";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "landing_page",
          interests: ["general"],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setEmail(""); // 清空输入框
      } else {
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Play className="w-12 h-12 text-purple-500" />,
      title: "Watch & Learn",
      description:
        "Learn English through your favorite TV shows and movies with interactive subtitles and vocabulary.",
    },
    {
      icon: <BookOpen className="w-12 h-12 text-orange-500" />,
      title: "Smart Vocabulary",
      description:
        "Build your vocabulary naturally with context-based learning and spaced repetition.",
    },
    {
      icon: <Users className="w-12 h-12 text-cyan-500" />,
      title: "Join Community",
      description:
        "Connect with learners worldwide and practice English in a supportive environment.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      location: "Taiwan",
      text: "EN Learning helped me improve my English so much! Learning through Friends was amazing.",
      rating: 5,
    },
    {
      name: "Marco Silva",
      location: "Brazil",
      text: "I finally understand American slang thanks to this platform. Highly recommended!",
      rating: 5,
    },
    {
      name: "Yuki Tanaka",
      location: "Japan",
      text: "The interactive subtitles make learning so much easier. Love this approach!",
      rating: 5,
    },
  ];

  return (
    <div className="bg-[#171212] min-h-screen">
      {/* Hero Section */}
      <section className="px-4 sm:px-10 md:px-20 lg:px-40 py-20 flex justify-center">
        <div className="max-w-6xl w-full text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Learn English Through
              <span className="bg-gradient-to-r from-purple-500 via-orange-500 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                Entertainment
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-[#b89e9e] mb-8 max-w-3xl mx-auto">
              Master English naturally by watching your favorite TV shows and
              movies. Interactive learning that doesn't feel like studying.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/series"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-orange-400 hover:from-purple-600 hover:to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
            >
              Start Learning Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/series"
              className="inline-flex items-center gap-2 border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-[#171212] px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Link>
          </div>

          {/* Hero Image/Video Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-[#382929] rounded-2xl p-8 border border-[#4a3a3a] relative overflow-hidden">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-orange-500/5 to-cyan-500/5 rounded-2xl"></div>
              <div className="aspect-video bg-[#2a1f1f] rounded-lg flex items-center justify-center relative">
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-t-purple-500 rounded-full animate-spin opacity-70"></div>
                    <div
                      className="absolute inset-2 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin opacity-70"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                    <div
                      className="absolute inset-4 w-12 h-12 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin opacity-70"
                      style={{ animationDelay: "0.6s" }}
                    ></div>
                  </div>
                  <p className="text-[#b89e9e]">
                    Interactive Learning Experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-10 md:px-20 lg:px-40 py-20 bg-[#1a1515]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose EN Learning?
            </h2>
            <p className="text-xl text-[#b89e9e] max-w-2xl mx-auto">
              Experience a revolutionary way to learn English that's engaging,
              effective, and enjoyable.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-[#382929] rounded-xl p-8 text-center hover:bg-[#423333] transition-all duration-300 border border-[#4a3a3a] hover:border-opacity-50 hover:shadow-lg group"
              >
                <div className="mb-6 flex justify-center transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-[#b89e9e] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Statistics */}
      <section className="px-4 sm:px-10 md:px-20 lg:px-40 py-16 bg-[#382929]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-purple-500 mb-2 group-hover:scale-105 transition-transform duration-300">
                10K+
              </div>
              <div className="text-[#b89e9e]">Active Learners</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-orange-500 mb-2 group-hover:scale-105 transition-transform duration-300">
                50+
              </div>
              <div className="text-[#b89e9e]">TV Series</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-cyan-500 mb-2 group-hover:scale-105 transition-transform duration-300">
                95%
              </div>
              <div className="text-[#b89e9e]">Success Rate</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                4.9★
              </div>
              <div className="text-[#b89e9e]">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-4 sm:px-10 md:px-20 lg:px-40 py-20 bg-[#171212]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Our Students Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-[#382929] rounded-xl p-6 border border-[#4a3a3a] hover:border-opacity-50 transition-all duration-300 hover:shadow-xl group"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-orange-500 fill-current group-hover:scale-110 transition-transform duration-300"
                      style={{ transitionDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-[#b89e9e] mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-semibold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-[#b89e9e] text-sm">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 sm:px-10 md:px-20 lg:px-40 py-20 bg-[#1a1515] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-orange-500/10 to-cyan-500/10"></div>

        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your English?
          </h2>
          <p className="text-xl text-[#b89e9e] mb-8">
            Join thousands of learners who are already improving their English
            through entertainment.
          </p>

          {/* Email Signup */}
          {/* <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 rounded-lg bg-[#382929] text-white placeholder-[#b89e9e] border border-[#4a3a3a] focus:border-purple-500 focus:outline-none disabled:opacity-50 transition-colors duration-300"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 shadow-lg"
              >
                {isSubmitting ? "Submitting..." : "Start Free"}
              </button>
            </div>
            {message && (
              <p
                className={`text-sm mt-2 ${message.includes("Thanks") || message.includes("Welcome") ? "text-cyan-500" : "text-orange-500"}`}
              >
                {message}
              </p>
            )}
            <p className="text-[#b89e9e] text-sm mt-2">
              No credit card required. Start learning immediately.
            </p>
          </form> */}
          {status === "loading" ? (
            <div className="flex justify-center">
              <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : !session ? (
            /* 未登入：顯示 Google 登入 */
            <div className="max-w-md mx-auto mb-8">
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white hover:bg-gray-100 text-gray-800 rounded-lg font-semibold transition-all duration-300 shadow-lg mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>
              <p className="text-[#b89e9e] text-sm">
                Sign in to save your progress and take notes while learning
              </p>
            </div>
          ) : (
            /* 已登入：顯示歡迎訊息和進入應用按鈕 */
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="text-left">
                  <p className="text-white font-semibold">Welcome back!</p>
                  <p className="text-[#b89e9e] text-sm">{session.user.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-[#2a1f1f] rounded-lg">
                <div className="text-center">
                  <p className="text-cyan-400 font-bold text-xl">
                    {session.user.totalNotes || 0}
                  </p>
                  <p className="text-[#b89e9e] text-sm">Notes</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-400 font-bold text-xl">
                    {Math.floor((session.user.totalWatchTime || 0) / 60)}h
                  </p>
                  <p className="text-[#b89e9e] text-sm">Watched</p>
                </div>
              </div>

              <Link
                href="/home"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg"
              >
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          <Link
            href="/series"
            className="inline-flex items-center gap-2 text-cyan-500 hover:text-cyan-400 font-semibold transition-colors duration-300"
          >
            Or browse our series collection
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
