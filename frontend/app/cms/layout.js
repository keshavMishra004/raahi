"use client";

import { usePathname } from 'next/navigation';
import React from 'react';
import Navbar from "./components/Nav.js";
import Sidebar from "./components/Sidebar.js";
import './css/layout.css'
import { CmsAuthProvider } from "@/app/context/CmsAuthContext";

export default function CmsLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/cms/login';

  return (
    <CmsAuthProvider>
      <div className="flex w-full min-h-screen">
        {/* Sidebar - Hidden on mobile, visible on lg */}
        <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
          <Sidebar />
        </div>

        {/* Mobile Sidebar - Overlay on small screens */}
        <div className="lg:hidden">
          <Sidebar />
        </div>

        {/* Main Content Area - Takes remaining space */}
        <div className="flex-1 flex flex-col w-full min-h-screen overflow-hidden">
          {/* Navbar - Sticky */}
          <div className="sticky top-0 z-20 w-full flex-shrink-0">
            <Navbar />
          </div>

          {/* Page Content - Scrollable */}
          <main className="flex-1 overflow-y-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </CmsAuthProvider>
  );
}