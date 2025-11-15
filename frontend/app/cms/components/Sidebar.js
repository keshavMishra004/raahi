"use client"
import Link from 'next/link'
import React, { useState } from 'react'
import { useCmsAuth } from "@/app/context/CmsAuthContext"
import { LayoutDashboard, Briefcase, Plane, Settings, BookOpen, Calendar, FileText, LogOut, Menu, X, ChevronRight } from 'lucide-react'
import { usePathname } from 'next/navigation'

function Sidebar() {
  const { logout } = useCmsAuth();
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/cms') return pathname === '/cms';
    return pathname.startsWith(href);
  };

  const navItems = [
    { href: '/cms', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/cms/company', label: 'Company Info', icon: Briefcase },
    { href: '/cms/aircraft', label: 'Aircraft Management', icon: Plane },
    { href: '/cms/bookings', label: 'Bookings', icon: BookOpen },
    { href: '/cms/pricing', label: 'Pricing & Calendar', icon: Calendar },
    { href: '/cms/policy', label: 'Policy & Reviews', icon: FileText },
    { href: '#', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-6 left-4 z-40 p-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-md"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative top-0 left-0 h-screen w-64 bg-gradient-to-b from-sky-900 via-sky-800 to-sky-900 text-white shadow-2xl transition-transform duration-300 ease-in-out z-30 flex flex-col overflow-y-auto`}
      >
        {/* Header */}
        <div className="px-6 py-8 border-b border-sky-700/50 sticky top-0 bg-gradient-to-r from-sky-900 to-sky-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-sky-300 rounded-lg flex items-center justify-center shadow-lg">
              <Plane size={22} className="text-sky-900 font-bold" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">RAAHi</h2>
              <p className="text-xs text-sky-300">CMS Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-sky-400 to-sky-300 text-sky-900 shadow-lg font-semibold'
                    : 'text-sky-100 hover:bg-sky-700/50 hover:text-sky-50 hover:translate-x-1'
                }`}
              >
                <Icon size={20} className={`flex-shrink-0 transition-transform ${active ? 'scale-110' : ''}`} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={18} className="opacity-75" />}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="px-4 py-2">
          <div className="h-px bg-sky-700/50"></div>
        </div>

        {/* Logout Button */}
        <div className="px-4 py-4 border-t border-sky-700/50">
          <button
            onClick={() => { logout(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-100 bg-red-900/20 hover:bg-red-900/40 hover:text-red-50 transition-all duration-200 border border-red-700/30 font-medium group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            <span>Logout</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="px-4 py-4 border-t border-sky-700/50 bg-sky-900/50">
          <p className="text-xs text-sky-300 text-center">
            © 2024 RAAHi Aviation<br />
            <span className="text-sky-400">All Rights Reserved</span>
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-20"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Sidebar