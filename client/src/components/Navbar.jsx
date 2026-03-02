import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/authContext";
import logoAura from "../assets/logo-aura.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const hasAccount = localStorage.getItem("aura_user_exists") === "true";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const getInitials = (name) => {
    if (!name) return "AI";
    const parts = name.split(" ");
    return parts
      .map((p) => p[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between w-full transition-all duration-500 px-6 md:px-16 lg:px-24 xl:px-32 ${
          scrolled
            ? "py-3 mt-3 mx-auto max-w-[92%] rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl"
            : "py-6 mt-0 max-w-full"
        }`}
      >
        <Link to="/" className="flex items-center group">
          <img
            src={logoAura}
            alt="Aura AI"
            className="h-10 w-auto min-w-[56px] transition-transform group-hover:scale-110"
          />
        </Link>

        <div className="hidden md:flex items-center gap-12 text-base font-bold">
          <Link
            to="/"
            className="text-white/70 hover:text-white transition-all"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white/70 hover:text-white transition-all"
          >
            About
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {!user ? (
            <button
              onClick={() => navigate(hasAccount ? "/login" : "/register")}
              className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 via-red-600 to-pink-500 border-2 border-white/30 hover:scale-105 transition-all shadow-lg text-sm"
            >
              {hasAccount ? "Login" : "Get Started"}
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-pink-500 flex items-center justify-center text-[10px] font-black text-white border border-white/20">
                  {getInitials(user.name)}
                </div>
                <span className="hidden md:block text-white font-bold text-xs">
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </div>
          )}

          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(true)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col p-10 md:hidden">
          <div className="flex justify-between items-center mb-10">
            <span className="text-2xl font-bold text-white">AuraAI</span>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-3xl"
            >
              ✕
            </button>
          </div>
          <div className="flex flex-col gap-6 text-xl text-white font-bold">
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            {!user ? (
              <button
                onClick={() => {
                  navigate(hasAccount ? "/login" : "/register");
                  setMenuOpen(false);
                }}
                className="text-left py-3 rounded-xl bg-orange-600 px-6"
              >
                {hasAccount ? "Login" : "Get Started"}
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                  setMenuOpen(false);
                }}
                className="text-left text-red-500"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
