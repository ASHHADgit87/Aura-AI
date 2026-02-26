import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/authContext";

const navItems = [
  { title: "Image Generator", icon: "🎨", route: "/image-generator" },
  { title: "PDF Summarizer", icon: "📄", route: "/pdf-summarizer" },
  { title: "Image Analyzer", icon: "🔍", route: "/image-analyzer" },
  { title: "Song Generator", icon: "🎵", route: "/song-generator" },
  { title: "BG Remover", icon: "✂️", route: "/bg-remover" },
  { title: "Translator", icon: "🌍", route: "/translator" },
  { title: "Grammar Fixer", icon: "✍️", route: "/grammar-fixer" },
  { title: "Web Scraper", icon: "🕷️", route: "/web-scraper" },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAppContext();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 border-r border-white/5 bg-[#0d0d1a]/80 backdrop-blur-md transition-all duration-300 ${
        collapsed ? "w-16" : "w-56"
      }`}
    >
      {/* Logo + Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold shrink-0">
              A
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Aura<span className="text-violet-400">AI</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-lg transition text-white/40 hover:text-white ml-auto"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1 px-2 py-4 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.route;
          return (
            <Link
              key={item.route}
              to={item.route}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-4 border-t border-white/5">
        {user && (
          <div className={`flex items-center gap-2 px-3 py-2 mb-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <span className="text-xs text-white/50 truncate">{user.name}</span>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2 px-3 py-2 w-full rounded-xl text-xs text-white/30 hover:text-red-400 hover:bg-white/5 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;