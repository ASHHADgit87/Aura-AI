import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Comment out for now
// import { useAppContext } from "../context/authContext";

const Navbar = () => {
  const navigate = useNavigate();
  // Use a fake user object temporarily
  // const { user, logout } = useAppContext();
  const user = null; // no backend yet
  const logout = () => {
    console.log("Logout clicked");
    navigate("/login");
  };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur-md bg-[#0d0d1a]/60 text-white">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
            A
          </div>
          <span className="text-lg font-bold tracking-tight">
            Aura<span className="text-violet-400">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
          <Link to="/" className="hover:text-white transition">
            Home
          </Link>
          <Link to="/image-generator" className="hover:text-white transition">
            Tools
          </Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="text-sm text-white/60 hover:text-white transition hidden md:block"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-5 py-1.5 text-sm bg-gradient-to-r from-violet-600 to-pink-600 hover:brightness-110 active:scale-95 transition rounded-lg text-white font-medium"
              >
                Get Started
              </button>
            </>
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-white/60">
                👤 <span className="text-white">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-1.5 text-xs bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
              >
                Logout
              </button>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden active:scale-90 transition"
            onClick={() => setMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h16" /><path d="M4 12h16" /><path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;