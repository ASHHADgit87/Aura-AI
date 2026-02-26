import React from "react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen"
      style={{
        background: `linear-gradient(180deg, #0d0d1a 0%, #1a0533 50%, #0d0d1a 100%)`,
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-lg font-bold animate-pulse">
          A
        </div>
        <p className="text-white/30 text-xs tracking-widest uppercase">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;