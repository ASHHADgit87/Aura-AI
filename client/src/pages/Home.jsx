import React from "react";
import { useNavigate } from "react-router-dom";

const features = [
  { title: "Image Generator", description: "Generate stunning images from text prompts instantly.", icon: "🎨", route: "/image-generator" },
  { title: "PDF Summarizer", description: "Upload any PDF and get a smart AI-powered summary.", icon: "📄", route: "/pdf-summarizer" },
  { title: "Image Analyzer", description: "Drop an image and let AI tell you everything about it.", icon: "🔍", route: "/image-analyzer" },
  { title: "Song Generator", description: "Create original AI music clips from a text description.", icon: "🎵", route: "/song-generator" },
  { title: "BG Remover", description: "Remove backgrounds from images with perfect precision.", icon: "✂️", route: "/bg-remover" },
  { title: "AI Translator", description: "Translate text across 50+ languages with neural quality.", icon: "🌍", route: "/translator" },
  { title: "Grammar Fixer", description: "Fix grammar, spelling and style errors with AI precision.", icon: "✍️", route: "/grammar-fixer" },
  { title: "Web Scraper", description: "Scrape any URL and convert it to clean JSON or Markdown.", icon: "🕷️", route: "/web-scraper" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <section
      className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins min-h-screen"
      style={{ background: `linear-gradient(180deg, #0d0d1a 0%, #1a0533 50%, #0d0d1a 100%)` }}
    >
      {/* Hero */}
      <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-24 font-semibold max-w-3xl">
        All your AI tools in one place, completely free.
      </h1>
      <p className="text-center text-base text-white/60 max-w-md mt-3">
        8 powerful AI features — generate images, summarize PDFs, create music, fix grammar and much more.
      </p>

      <button
        onClick={() => navigate("/register")}
        className="mt-8 px-8 py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:brightness-110 rounded-xl font-medium transition-all"
      >
        Start for Free →
      </button>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full mt-20">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => navigate(feature.route)}
            className="bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
            <p className="text-white/40 text-xs leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;