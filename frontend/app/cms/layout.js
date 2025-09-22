"use client";

import { usePathname } from 'next/navigation';
import Navbar from "./components/Nav.js";
import Sidebar from "./components/Sidebar.js";
import './css/layout.css'
import { CmsAuthProvider } from "@/app/context/CmsAuthContext";

export default function CmsLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/cms/login';

  return (
    <CmsAuthProvider>
      <div className="layout">
        {/* Conditionally render the sidebar */}
        {!isLoginPage && <Navbar />}

        <div className="main">
          {!isLoginPage && <Sidebar />}

          <main className="mainpage">
            {children}
          </main>
        </div>
      </div>
    </CmsAuthProvider>
  );
}