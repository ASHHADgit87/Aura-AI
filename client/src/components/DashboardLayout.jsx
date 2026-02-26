import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div
      className="flex min-h-screen text-white"
      style={{
        background: `linear-gradient(180deg, #0d0d1a 0%, #1a0533 50%, #0d0d1a 100%)`,
      }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;