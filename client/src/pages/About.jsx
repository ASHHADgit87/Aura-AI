import React, { Suspense, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const BubbleField = ({ count = 500 }) => {
  const mesh = useRef();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        t: Math.random() * 100,
        speed: 0.02 + Math.random() * 0.05,
        x: (Math.random() - 0.5) * 40,
        yStart: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 20,
        size: 0.05 + Math.random() * 0.15,
        color: ["#FF7A18", "#E10600", "#FF4DA6"][Math.floor(Math.random() * 3)],
      });
    }
    return temp;
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, speed, x, yStart, z, size } = particle;
      particle.t += speed;
      const yPos = ((particle.t + yStart) % 40) - 20;
      const xOscillation = Math.sin(particle.t * 0.5) * 0.5;

      dummy.position.set(x + xOscillation, yPos, z);
      dummy.scale.set(size, size, size);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
      mesh.current.setColorAt(i, new THREE.Color(particle.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor)
      mesh.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        roughness={0}
        metalness={0.8}
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

const GlowCard = ({ children, className = "" }) => (
  <div
    className={`relative rounded-2xl p-8 backdrop-blur-md border border-white/5 bg-white/5 shadow-2xl ${className}`}
  >
    {children}
  </div>
);

const About = () => {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Image Generator",
      model: "SDXL 1.0 (Stability AI)",
      limit: "Unlimited · Free",
      description:
        "Cinematic-grade synthesis specializing in complex textures and professional lighting.",
      about:
        "Aura-AI utilizes the SDXL 1.0 architecture, featuring a dual-encoder system for superior prompt adherence. This model excels in anatomical accuracy and photorealism, delivering high-resolution digital illustrations and cinematic assets that outperform standard generative models in artistic depth.",
      color: "#FF7A18",
    },
    {
      title: "PDF Summarizer",
      model: "Meta Llama 3.2 (Hugging Face)",
      limit: "100 req/day · Free",
      description:
        "AI extraction for research papers and reports to return structured summaries.",
      about:
        "Utilizing Meta's Llama-3.2 via Hugging Face, this tool identifies key semantic milestones and extracts data points from dense PDFs. It provides a logical hierarchy of information, ideal for processing academic papers and complex engineering reports efficiently.",
      color: "#FF7A18",
    },
    {
      title: "Image Analyzer",
      model: "Gemini 2.5 Flash (Google Vision)",
      limit: "1,500 req/day · Free",
      description:
        "Detailed breakdown including object detection, colors, and natural description.",
      about:
        "Powered by Google's latest Gemini 2.5 Flash model, this analyzer performs multimodal pixel-level scans. It bridges the gap between visual data and natural language, identifying specific colors, textures, and objects with a high degree of accuracy and contextual understanding.",
      color: "#E10600",
    },
    {
      title: "Song Generator",
      model: "Meta MusicGen",
      limit: "10 req/day · Free",
      description:
        "Composes original audio clips tailored to your genre and instrument descriptions.",
      about:
        "Aura-AI transforms textual vibes into audible reality. By utilizing neural audio synthesis, MusicGen crafts unique 30-second compositions. It understands the nuances of instruments, BPM, and mood, providing creators with royalty-free background scores for videos and games.",
      color: "#FF4DA6",
    },
    {
      title: "Background Remover",
      model: "Remove.bg API",
      limit: "50 req/day · Free",
      description:
        "Professional removal for portraits and products, delivering transparent PNGs.",
      about:
        "Using sophisticated edge-detection algorithms, this tool isolates the foreground from the most complex backgrounds—including hair and fine details. It is an essential utility for e-commerce developers and graphic designers looking to streamline their post-production pipeline.",
      color: "#FF7A18",
    },
    {
      title: "AI Translator",
      model: "LibreTranslate",
      limit: "Unlimited · Free",
      description:
        "Neural translation across 55+ languages including Urdu and Arabic.",
      about:
        "Our translation engine bypasses simple word-to-word swapping for true neural machine translation. It maintains the grammatical integrity and cultural context of 55+ languages, ensuring that communication is not just translated, but understood across global boundaries.",
      color: "#E10600",
    },
    {
      title: "Grammar Fixer",
      model: "LanguageTool API",
      limit: "20 req/day · Free",
      description:
        "Deep analysis of grammar and style with one-click automated fixes.",
      about:
        "More than a spellchecker, this tool analyzes the syntactic structure of your writing. It detects tonal inconsistencies, passive voice, and stylistic errors, offering intelligent suggestions to elevate the professional quality of your emails, essays, and code documentation.",
      color: "#FF4DA6",
    },
    {
      title: "Web Scraper",
      model: "ScrapeGraphAI",
      limit: "25 req/day · Free",
      description:
        "Context-aware scraping that returns structured JSON data from any URL.",
      about:
        "Harnessing the power of LLMs for data extraction, this scraper understands the visual and structural layout of websites. It converts messy HTML into clean, structured JSON formats, enabling developers to automate data collection without writing complex CSS selectors.",
      color: "#FF7A18",
    },
  ];

  const techStack = [
    {
      label: "Frontend",
      value: "React.js",
      logo: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg",
    },
    {
      label: "Styling",
      value: "Tailwind CSS",
      logo: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg",
    },
    {
      label: "Backend",
      value: "Node.js",
      logo: "https://nodejs.org/static/images/logo.svg",
    },
    {
      label: "Backend Framework",
      value: "Express.js",
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png",
    },
    {
      label: "Database",
      value: "MongoDB",
      logo: "https://webassets.mongodb.com/_com_assets/cms/mongodb_logo1-76twgcu2dm.png",
    },
    {
      label: "HTTP Client",
      value: "Axios",
      logo: "https://axios-http.com/assets/logo.svg",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white font-sans overflow-x-hidden selection:bg-orange-500/30">
      <div className="fixed inset-0 z-0 pointer-events-none bg-black">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[15, 15, 15]} intensity={2} color="#ffffff" />
          <Suspense fallback={null}>
            <BubbleField count={500} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <section className="text-center mb-32">
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter">
            Meet{" "}
            <span className="bg-gradient-to-r from-[#FF7A18] via-[#E10600] to-[#FF4DA6] bg-clip-text text-transparent">
              Aura-AI
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A unified full-stack ecosystem engineered to provide 8 sophisticated
            AI tools at zero cost. Built on high-performance models for
            professional utility.
          </p>
        </section>

        <section className="mb-32">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Core System Capabilities
          </h2>
          <div className="grid md:grid-cols-1 gap-8">
            {" "}
            {tools.map((tool, i) => (
              <GlowCard
                key={i}
                className="hover:border-white/20 transition-all duration-700"
              >
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div
                    className="w-full md:w-1.5 h-1.5 md:h-32 rounded-full"
                    style={{ background: tool.color }}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-center mb-4">
                      <h3 className="text-2xl font-bold tracking-tight">
                        {tool.title}
                      </h3>
                      <p className="text-[10px] font-mono text-orange-500 uppercase tracking-widest">
                        {tool.model} • {tool.limit}
                      </p>
                    </div>
                    <p className="text-lg text-gray-200 mb-4 font-medium">
                      {tool.description}
                    </p>
                    <p className="text-sm text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                      {tool.about}
                    </p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </section>

        <section className="mb-32">
          <h2 className="text-center text-sm font-bold mb-16 uppercase tracking-[0.3em] text-gray-500">
            Tech Stack
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-10">
            {techStack.map((tech, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 mb-4 p-2">
                  <img
                    src={tech.logo}
                    alt={tech.value}
                    className="w-full h-full object-contain"
                    style={{
                      filter:
                        "drop-shadow(0 0 4px rgba(255,255,255,0.5)) drop-shadow(0 0 8px rgba(255,255,255,0.3))",
                      animation: "glowPulse 3s ease-in-out infinite alternate",
                    }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center text-white">
                  {tech.value}
                </span>
              </div>
            ))}
          </div>

          <style>
            {`
      @keyframes glowPulse {
        0% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.5)) drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
        50% { filter: drop-shadow(0 0 6px rgba(255,255,255,0.6)) drop-shadow(0 0 10px rgba(255,255,255,0.4)); }
        100% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.5)) drop-shadow(0 0 8px rgba(255,255,255,0.3)); }
      }
    `}
          </style>
        </section>

        <section className="mb-32">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col items-center text-center gap-6">
            <h3 className="text-3xl font-bold tracking-tighter">
              Muhammad Ashhadullah Zaheer
            </h3>

            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest">
              Software Engineer | Full Stack Developer
            </p>

            <p className="text-gray-400 leading-relaxed text-sm max-w-2xl">
              Dedicated to building high-performance AI SaaS products. Aura-AI
              serves as a proof of concept that sophisticated generative tools
              can be offered for free without compromising on quality or UI.
            </p>

            <div className="flex gap-6 mt-4">
              <a
                href="https://github.com/ashhadgit87/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 text-sm font-semibold"
              >
                GitHub
              </a>

              <a
                href="https://linkedin.com/in/muhammad-ashhadullah-zaheer-41194a340/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition-all duration-300 text-sm font-semibold"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        <section className="text-center pb-20">
          <button
            onClick={() => navigate("/")}
            className="group relative px-14 py-5 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:shadow-[0_0_50px_rgba(255,122,24,0.4)] active:scale-95"
          >
            <span className="relative z-10 text-xs uppercase tracking-[0.2em]">
              Start Generating...
            </span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default About;
