import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logoAura from "../assets/logo-aura.svg";

const navItems = [
  { title: "Image Generator", route: "/image-generator" },
  { title: "PDF Summarizer", route: "/pdf-summarizer" },
  { title: "Image Analyzer", route: "/image-analyzer" },
  { title: "Song Generator", route: "/song-generator" },
  { title: "BG Remover", route: "/bg-remover" },
  { title: "Translator", route: "/translator" },
  { title: "Grammar Fixer", route: "/grammar-fixer" },
  { title: "Web Scraper", route: "/web-scraper" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className="flex flex-col min-h-screen transition-all duration-300"
        style={{
          width: collapsed ? "70px" : "240px",
          background: "linear-gradient(180deg, #FF7A18 0%, #E10600 60%)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-6">
          {!collapsed && (
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAura} alt="Aura AI" className="h-8 w-auto" />
            </Link>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-black/10 hover:bg-white/20 text-white text-sm transition-all"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex flex-col gap-2 px-3 mt-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.route;

            return (
              <Link
                key={item.route}
                to={item.route}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-3"
                style={
                  isActive
                    ? {
                        background: "rgba(0,0,0,0.4)",
                        color: "#ffffff",
                      }
                    : {
                        background: "rgba(0,0,0,0.2)",
                        color: "rgba(255,255,255,0.8)",
                      }
                }
              >
                {isActive && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#FF4DA6" }}
                  ></span>
                )}

                {!collapsed && item.title}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="w-[1px] bg-white min-h-screen"></div>
    </>
  );
};

export default Sidebar;
