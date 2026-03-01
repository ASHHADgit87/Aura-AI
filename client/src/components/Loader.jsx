import React from "react";

const Loader = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{ background: "linear-gradient(180deg, #0F0F14 0%, #1A0C08 50%, #0F0F14 100%)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold animate-pulse"
          style={{
            background: "linear-gradient(135deg, #FF7A18, #E10600)",
            boxShadow: "0 0 30px rgba(255,122,24,0.5)",
          }}
        >
          A
        </div>
        <p className="text-xs tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;