'use client';
import React from 'react';
import Sidebar from './sidebar';
import AIChatbot from './components/ai-chatbot';
import './css/global-dashboard.css';
import './css/layout.css';

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <div className="layout-wrapper">
        <aside className="sidebar-container">
          <div className="sidebar-sticky">
            <Sidebar />
          </div>
        </aside>

        <main className="main-content">
          {children}
        </main>
      </div>
      
      <AIChatbot />
    </div>
  );
}
