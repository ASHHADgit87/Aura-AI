import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const tools = [
  {
    icon: "🎨",
    title: "Image Generator",
    route: "/image-generator",
    model: "Stable Diffusion (FLUX) via Pollinations.ai",
    modelShort: "Pollinations.ai",
    limit: "Unlimited · Free",
    description: "Transform any text prompt into stunning high-resolution artwork. From photorealistic renders to abstract compositions — the model understands lighting, depth, style, and mood.",
    how: "Type a detailed description of what you want to see. The more specific you are — art style, lighting, mood — the better the result. Press Enter or click Generate.",
    color: "#FF7A18",
  },
  {
    icon: "📄",
    title: "PDF Summarizer",
    route: "/pdf-summarizer",
    model: "LLaMA (Public Proxy)",
    modelShort: "LLaMA",
    limit: "100 req/day · Free",
    description: "Upload any PDF — research papers, legal docs, reports — and receive a concise, intelligent summary that captures the core ideas without the fluff.",
    how: "Click the upload zone or drag & drop your PDF (max 10MB). Hit Summarize and the AI extracts the text, processes it through LLaMA, and returns a structured summary.",
    color: "#FF7A18",
  },
  {
    icon: "🔍",
    title: "Image Analyzer",
    route: "/image-analyzer",
    model: "DeepAI Vision API",
    modelShort: "DeepAI Vision",
    limit: "300 req/day · Free",
    description: "Drop any image and receive a detailed AI-powered breakdown — object detection, scene classification, color analysis, labels, and a natural language description.",
    how: "Upload a JPG, PNG, or WEBP image (max 5MB). Click Analyze Image and DeepAI's vision model scans every pixel, returning labels and a full description you can copy.",
    color: "#E10600",
  },
  {
    icon: "🎵",
    title: "Song Generator",
    route: "/song-generator",
    model: "Meta MusicGen via Hugging Face",
    modelShort: "MusicGen",
    limit: "10 req/day · Free",
    description: "Describe a musical vibe — genre, tempo, instruments, mood — and Meta's MusicGen model composes an original audio clip tailored exactly to your description.",
    how: "Write a music prompt like 'chill lo-fi hip hop with rain sounds'. Hit Generate and wait 20–30 seconds. Download the .wav file and use it anywhere.",
    color: "#FF4DA6",
  },
  {
    icon: "✂️",
    title: "Background Remover",
    route: "/bg-remover",
    model: "Remove.bg API",
    modelShort: "Remove.bg",
    limit: "50 req/day · Free",
    description: "Professional-grade background removal powered by Remove.bg. Works on portraits, products, animals, and complex scenes — delivering clean transparent PNG output.",
    how: "Upload your image. Click Remove Background. The result appears side-by-side with the original — with a checkered pattern showing the transparent areas. Download as PNG.",
    color: "#FF7A18",
  },
  {
    icon: "🌍",
    title: "AI Translator",
    route: "/translator",
    model: "LibreTranslate (Neural MT)",
    modelShort: "LibreTranslate",
    limit: "Unlimited · Free",
    description: "Neural machine translation across 55+ languages including Urdu, Arabic, Chinese, Hindi, and all major European languages — with swap functionality and copy support.",
    how: "Select source and target languages from the dropdowns. Paste or type your text. Hit Translate. Swap languages and text with the arrow button anytime.",
    color: "#E10600",
  },
  {
    icon: "✍️",
    title: "Grammar Fixer",
    route: "/grammar-fixer",
    model: "LanguageTool API",
    modelShort: "LanguageTool",
    limit: "20 req/day · Free",
    description: "Deep grammar, spelling, punctuation, and style analysis powered by LanguageTool. Each issue is shown with a red/green inline diff and one-click Apply All Fixes.",
    how: "Paste your text into the input box. Click Check Grammar. Review each flagged issue with its suggested fix. Hit Apply All Fixes to correct everything in one click.",
    color: "#FF4DA6",
  },
  {
    icon: "🕷️",
    title: "Web Scraper",
    route: "/web-scraper",
    model: "ScrapeGraphAI",
    modelShort: "ScrapeGraphAI",
    limit: "25 req/day · Free",
    description: "AI-powered web scraping that understands context — not just raw HTML. Enter a URL and an optional prompt, and receive structured JSON data you can explore in table or raw view.",
    how: "Enter any URL starting with http. Optionally describe what you want to extract (e.g. 'product names and prices'). Toggle between Table and JSON views. Copy with one click.",
    color: "#FF7A18",
  },
];

const developer = {
  name: "Muhammad Ashhadullah Zaheer",
  role: "Full Stack Developer",
  linkedin: "https://www.linkedin.com/in/muhammad-ashhadullah-zaheer-41194a340/",
  stack: ["React.js", "Node.js", "Express.js", "MongoDB", "Tailwind CSS", "Vite"],
  bio: "Passionate full-stack developer with a focus on building AI-powered SaaS products. Aura-AI was built to prove that cutting-edge AI tools don't need to cost anything.",
};

const techStack = [
  { label: "Frontend", value: "React.js + Vite", icon: "⚛️" },
  { label: "Styling", value: "Tailwind CSS", icon: "🎨" },
  { label: "Backend", value: "Node.js + Express.js", icon: "🔧" },
  { label: "Database", value: "MongoDB Atlas", icon: "🗄️" },
  { label: "Auth", value: "JWT + bcrypt", icon: "🔐" },
  { label: "HTTP Client", value: "Axios", icon: "📡" },
];

// Animated fire particle background
const FireCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 1.5 + 0.5),
        life: Math.random(),
        maxLife: Math.random() * 0.7 + 0.3,
        size: Math.random() * 3 + 1,
      });
    }

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.004;
        if (p.life <= 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + 10;
          p.life = p.maxLife;
          p.vx = (Math.random() - 0.5) * 0.5;
          p.vy = -(Math.random() * 1.5 + 0.5);
        }
        const alpha = p.life / p.maxLife;
        const hue = p.life > 0.5 ? 30 : p.life > 0.25 ? 10 : 340;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha * 0.3})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.6 }}
    />
  );
};

const GlowCard = ({ children, style = {}, className = "" }) => (
  <div
    className={`relative rounded-2xl transition-all duration-300 group ${className}`}
    style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      backdropFilter: "blur(12px)",
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.border = "1px solid rgba(255,122,24,0.45)";
      e.currentTarget.style.transform = "translateY(-4px) scale(1.01)";
      e.currentTarget.style.boxShadow = "0 20px 60px rgba(225,6,0,0.2), 0 0 30px rgba(255,122,24,0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
      e.currentTarget.style.transform = "translateY(0) scale(1)";
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: "linear-gradient(135deg, rgba(255,122,24,0.06) 0%, rgba(225,6,0,0.04) 100%)" }} />
    {children}
  </div>
);

const About = () => {
  const navigate = useNavigate();
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  const activeTool = tools[activeToolIndex];

  return (
    <div
      className="relative min-h-screen font-poppins text-white overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #0F0F14 0%, #1A0C08 50%, #0F0F14 100%)" }}
    >
      <FireCanvas />

      <div className="relative z-10 flex flex-col items-center px-4 md:px-8 pb-32">

        {/* ─── HERO ─────────────────────────────────── */}
        <div className="flex flex-col items-center text-center mt-24 mb-20 max-w-5xl w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: "rgba(255,122,24,0.1)",
              border: "1px solid rgba(255,122,24,0.3)",
              color: "#FF7A18",
            }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#FF7A18" }} />
            8 Free AI Tools · No Credit Card · No Limits
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6"
            style={{ color: "#F5F5F7" }}>
            Meet{" "}
            <span style={{
              background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Aura-AI
            </span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl leading-relaxed mb-10"
            style={{ color: "rgba(255,255,255,0.55)" }}>
            A full-stack AI SaaS platform that brings 8 powerful AI tools under one roof — completely free. Built on the best free AI models available. No subscriptions. No paywalls.
          </p>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <button onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:brightness-110 hover:scale-105"
              style={{
                background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)",
                boxShadow: "0 0 40px rgba(255,122,24,0.45)",
              }}>
              Get Started Free →
            </button>
            <button onClick={() => navigate("/")}
              className="px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
              Back to Home
            </button>
          </div>
        </div>

        {/* ─── STATS BAR ───────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full mb-24">
          {[
            { value: "8", label: "AI Tools" },
            { value: "100%", label: "Free Forever" },
            { value: "55+", label: "Languages" },
            { value: "0", label: "Subscriptions" },
          ].map((stat, i) => (
            <GlowCard key={i} className="p-6 text-center">
              <div className="text-3xl font-bold mb-1"
                style={{
                  background: "linear-gradient(to right, #FF7A18, #E10600)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{stat.label}</div>
            </GlowCard>
          ))}
        </div>

        {/* ─── TOOLS EXPLORER ─────────────────────── */}
        <div className="w-full max-w-6xl mb-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#F5F5F7" }}>
              Explore the{" "}
              <span style={{
                background: "linear-gradient(to right, #FF7A18, #E10600)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Tools</span>
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Click any tool to learn how it works, which model powers it, and how to use it.</p>
          </div>

          <div className="flex gap-6 flex-col lg:flex-row">
            {/* Tool Tabs */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible lg:w-64 shrink-0 pb-2 lg:pb-0">
              {tools.map((tool, i) => (
                <button
                  key={i}
                  onClick={() => setActiveToolIndex(i)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm whitespace-nowrap lg:whitespace-normal transition-all duration-200 text-left w-full"
                  style={
                    activeToolIndex === i
                      ? {
                          background: "rgba(225,6,0,0.15)",
                          borderLeft: "2px solid #FF7A18",
                          color: "#FF7A18",
                          paddingLeft: "14px",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.06)",
                          color: "rgba(255,255,255,0.45)",
                        }
                  }
                  onMouseEnter={(e) => { if (activeToolIndex !== i) { e.currentTarget.style.color = "#F5F5F7"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; } }}
                  onMouseLeave={(e) => { if (activeToolIndex !== i) { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
                >
                  <span className="text-lg shrink-0">{tool.icon}</span>
                  <span className="font-medium text-xs">{tool.title}</span>
                </button>
              ))}
            </div>

            {/* Tool Detail Card */}
            <div className="flex-1 rounded-2xl p-6 md:p-8 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,122,24,0.2)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 0 50px rgba(225,6,0,0.1), inset 0 0 60px rgba(255,122,24,0.03)",
              }}>
              {/* BG glow blob */}
              <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,122,24,0.08) 0%, transparent 70%)" }} />

              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                  style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)", boxShadow: "0 0 20px rgba(255,122,24,0.4)" }}>
                  {activeTool.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold" style={{ color: "#F5F5F7" }}>{activeTool.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ background: "rgba(255,122,24,0.12)", border: "1px solid rgba(255,122,24,0.25)", color: "#FF7A18" }}>
                      {activeTool.modelShort}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}>
                      {activeTool.limit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-6">
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(255,122,24,0.7)" }}>What it does</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{activeTool.description}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(225,6,0,0.8)" }}>How to use it</p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>{activeTool.how}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Powered by <span style={{ color: "#FF7A18" }}>{activeTool.model}</span>
                </div>
                <button onClick={() => navigate(activeTool.route)}
                  className="px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:brightness-110"
                  style={{ background: "linear-gradient(to right, #FF7A18, #E10600)", boxShadow: "0 0 20px rgba(255,122,24,0.3)" }}>
                  Try {activeTool.title} →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── ALL MODELS TABLE ────────────────────── */}
        <div className="w-full max-w-5xl mb-24">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#F5F5F7" }}>
              AI Models &{" "}
              <span style={{
                background: "linear-gradient(to right, #FF7A18, #FF4DA6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>APIs Used</span>
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>All models and APIs are 100% free — zero cost to run this project.</p>
          </div>

          <GlowCard className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {["Tool", "Model / API", "Provider", "Daily Limit"].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs uppercase tracking-widest font-medium"
                      style={{ color: "rgba(255,255,255,0.3)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tools.map((tool, i) => (
                  <tr key={i}
                    className="transition-colors cursor-pointer"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,122,24,0.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    onClick={() => navigate(tool.route)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span>{tool.icon}</span>
                        <span className="font-medium" style={{ color: "#F5F5F7" }}>{tool.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs" style={{ color: "#FF7A18" }}>{tool.modelShort}</td>
                    <td className="px-6 py-4 text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{tool.model.split("via ")[1] || tool.model.split(" ")[0]}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs"
                        style={{ background: "rgba(255,122,24,0.1)", border: "1px solid rgba(255,122,24,0.2)", color: "#FF7A18" }}>
                        {tool.limit.split("·")[0].trim()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlowCard>
        </div>

        {/* ─── TECH STACK ──────────────────────────── */}
        <div className="w-full max-w-5xl mb-24">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#F5F5F7" }}>
              Tech{" "}
              <span style={{
                background: "linear-gradient(to right, #E10600, #FF7A18)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Stack</span>
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Modern, battle-tested technologies for performance and scale.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {techStack.map((tech, i) => (
              <GlowCard key={i} className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ background: "rgba(255,122,24,0.1)", border: "1px solid rgba(255,122,24,0.2)" }}>
                  {tech.icon}
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>{tech.label}</p>
                  <p className="text-sm font-semibold" style={{ color: "#F5F5F7" }}>{tech.value}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* ─── HOW IT WORKS ────────────────────────── */}
        <div className="w-full max-w-5xl mb-24">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#F5F5F7" }}>
              How{" "}
              <span style={{
                background: "linear-gradient(to right, #FF7A18, #FF4DA6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>It Works</span>
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>Three simple steps to unlock all 8 AI tools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px"
              style={{ background: "linear-gradient(to right, rgba(255,122,24,0.4), rgba(225,6,0,0.4))" }} />

            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds — no credit card, no verification. Just name, email, and password.", icon: "👤" },
              { step: "02", title: "Choose a Tool", desc: "Pick any of the 8 AI tools from the sidebar. Each one is purpose-built and ready to use.", icon: "🛠️" },
              { step: "03", title: "Generate & Download", desc: "Run the AI, review your output, and download the result. Images, audio, text — all yours.", icon: "⬇️" },
            ].map((step, i) => (
              <GlowCard key={i} className="p-6 text-center relative">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4"
                  style={{
                    background: "linear-gradient(135deg, #FF7A18, #E10600)",
                    boxShadow: "0 0 20px rgba(255,122,24,0.4)",
                    color: "#fff",
                  }}>
                  {step.step}
                </div>
                <div className="text-3xl mb-3">{step.icon}</div>
                <h3 className="font-bold mb-2" style={{ color: "#F5F5F7" }}>{step.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{step.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* ─── DEVELOPER CARD ──────────────────────── */}
        <div className="w-full max-w-3xl mb-20">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2" style={{ color: "#F5F5F7" }}>
              The{" "}
              <span style={{
                background: "linear-gradient(to right, #FF7A18, #E10600)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>Developer</span>
            </h2>
          </div>

          <div className="rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,122,24,0.25)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 0 60px rgba(225,6,0,0.12), inset 0 0 80px rgba(255,122,24,0.03)",
            }}>
            {/* Decorative glow blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(255,122,24,0.1) 0%, transparent 70%)" }} />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(225,6,0,0.08) 0%, transparent 70%)" }} />

            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0"
                style={{
                  background: "linear-gradient(135deg, #FF7A18, #E10600, #FF4DA6)",
                  boxShadow: "0 0 30px rgba(255,122,24,0.5)",
                  color: "#fff",
                  fontSize: "28px",
                }}>
                {developer.name.charAt(0)}
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1" style={{ color: "#F5F5F7" }}>{developer.name}</h3>
                <p className="text-xs mb-3 font-medium" style={{ color: "#FF7A18" }}>{developer.role}</p>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "rgba(255,255,255,0.55)" }}>{developer.bio}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {developer.stack.map((tech, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs"
                      style={{ background: "rgba(255,122,24,0.1)", border: "1px solid rgba(255,122,24,0.2)", color: "#FF7A18" }}>
                      {tech}
                    </span>
                  ))}
                </div>

                <a href={developer.linkedin} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold transition-all duration-300 hover:brightness-110"
                  style={{
                    background: "linear-gradient(to right, #FF7A18, #E10600)",
                    boxShadow: "0 0 20px rgba(255,122,24,0.35)",
                    color: "#fff",
                  }}>
                  <span>🔗</span> Connect on LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ─── FINAL CTA ───────────────────────────── */}
        <div className="w-full max-w-3xl text-center">
          <div className="rounded-2xl p-12 relative overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,122,24,0.2)",
              backdropFilter: "blur(16px)",
            }}>
            <div className="absolute inset-0 pointer-events-none rounded-2xl"
              style={{ background: "linear-gradient(135deg, rgba(255,122,24,0.08) 0%, rgba(225,6,0,0.05) 50%, rgba(255,77,166,0.04) 100%)" }} />
            <div className="relative z-10">
              <div className="text-4xl mb-4">🔥</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#F5F5F7" }}>
                Ready to use Aura-AI?
              </h2>
              <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.5)" }}>
                8 powerful AI tools. Zero cost. Start creating in seconds.
              </p>
              <button onClick={() => navigate("/register")}
                className="px-10 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 hover:brightness-110 hover:scale-105"
                style={{
                  background: "linear-gradient(to right, #FF7A18, #E10600, #FF4DA6)",
                  boxShadow: "0 0 40px rgba(255,122,24,0.5)",
                  color: "#fff",
                }}>
                Create Free Account →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;