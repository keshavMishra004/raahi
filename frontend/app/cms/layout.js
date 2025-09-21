"use client";

import Navbar from "./components/Nav.js";
import Sidebar from "./components/Sidebar.js";
import './css/layout.css'

export default function CmsLayout({ children }) {
  return (
    <div className="layout">
      {/* Sidebar always visible */}
      <Navbar />

      <div className="main">
        {/* Optional top navbar */}
        <Sidebar />

        {/* Page-specific content */}
        <main className="mainpage">
          {children}
        </main>
      </div>
    </div>
  );
}
