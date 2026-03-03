import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div
      className="flex min-h-screen text-white"
      style={{
        background:
          "linear-gradient(180deg, #0F0F14 0%, #1A0C08 50%, #0F0F14 100%)",
      }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;
