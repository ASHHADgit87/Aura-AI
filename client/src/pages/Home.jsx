import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/authContext";

const features = [
  {
    title: "Generate Images",
    description:
      "Bring your ideas to life with stunning visuals powered by Aura-AI.",
    route: "/image-generator",
  },
  {
    title: "Summarize PDFs",
    description:
      "Quickly understand any PDF with concise, AI-driven summaries from Aura-AI.",
    route: "/pdf-summarizer",
  },
  {
    title: "Analyze Images",
    description:
      "Get deep insights and detailed analysis for any image using Aura-AI.",
    route: "/image-analyzer",
  },
  {
    title: "AI Code Explainer",
    description:
      "Paste your code and get a detailed explanation with comments instantly with Aura AI.",
    route: "/code-explainer",
  },
  {
    title: "Remove Backgrounds",
    description:
      "Instantly remove image backgrounds with precision using Aura-AI technology.",
    route: "/bg-remover",
  },
  {
    title: "Translate Text",
    description:
      "Translate text seamlessly across 50+ languages using Aura-AI’s smart translation.",
    route: "/translator",
  },
  {
    title: "Fix Grammar",
    description:
      "Enhance your writing with accurate grammar and style corrections powered by Aura-AI.",
    route: "/grammar-fixer",
  },
  {
    title: "Scrape Web Data",
    description:
      "Extract clean, structured data from any website quickly and efficiently with Aura-AI.",
    route: "/web-scraper",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { user, hasAccount } = useAppContext();

  const handleFeatureClick = (route) => {
    if (user) {
      navigate(route);
    } else {
      navigate(hasAccount ? "/login" : "/register");
    }
  };

  return (
    <section
      className="flex flex-col items-center text-white pb-20 px-6 font-poppins min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #FF7A18 0%, #E10600 40%, #E10600 80%, #FF4DA6 100%)",
      }}
    >
      <h1 className="text-center text-4xl md:text-6xl font-bold mt-24 max-w-4xl leading-tight">
        All your AI tools on one Platform - Experience The Ultimate Aura AI
      </h1>

      <p className="text-center text-base md:text-lg max-w-xl mt-6 text-white/90">
        Aura-AI features 8 Powerful Tools—{" "}
        <span className="font-bold decoration-white/40">
          completely free with no pricing.
        </span>
      </p>

      {!user && (
        <button
          onClick={() => navigate(hasAccount ? "/login" : "/register")}
          className="mt-8 px-10 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:border-white/70 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          {hasAccount ? "Login to Continue →" : "Get Started for Free →"}
        </button>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl w-full mt-24">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={() => handleFeatureClick(feature.route)}
            className="relative bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(255,122,24,0.6)]"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-orange-500 via-red-600 to-pink-500 opacity-10 pointer-events-none"></div>
            <h3 className="font-semibold text-lg mb-3 z-10 relative">
              {feature.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed z-10 relative">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
