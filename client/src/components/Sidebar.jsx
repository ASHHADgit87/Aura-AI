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
      className="flex flex-col h-screen sticky top-0 transition-all duration-300"
      style={{
        width: collapsed ? "64px" : "224px",
        background: "#0F0F14",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Logo + Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>
              A
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              Aura<span style={{ color: "#FF7A18" }}>AI</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all ml-auto"
          style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,122,24,0.15)"; e.currentTarget.style.color = "#FF7A18"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.4)"; }}
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={
                isActive
                  ? {
                      background: "rgba(225,6,0,0.12)",
                      color: "#FF7A18",
                      borderLeft: "2px solid #FF7A18",
                      paddingLeft: "10px",
                    }
                  : { color: "rgba(255,255,255,0.4)" }
              }
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = "#F5F5F7"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = "rgba(255,255,255,0.4)"; e.currentTarget.style.background = "transparent"; } }}
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-2 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        {user && (
          <div className={`flex items-center gap-2 px-3 py-2 mb-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: "linear-gradient(135deg, #FF7A18, #E10600)" }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <span className="text-xs truncate" style={{ color: "rgba(255,255,255,0.5)" }}>{user.name}</span>
            )}
          </div>
        )}
        <button
          onClick={logout}
          className={`flex items-center gap-2 px-3 py-2 w-full rounded-xl text-xs transition-all ${collapsed ? "justify-center" : ""}`}
          style={{ color: "rgba(255,255,255,0.3)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#E10600"; e.currentTarget.style.background = "rgba(225,6,0,0.08)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.background = "transparent"; }}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;