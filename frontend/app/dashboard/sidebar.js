'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Icon = ({ name }) => {
  if (name === 'profile') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1118.88 6.196 9 9 0 015.12 17.804zM15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
  if (name === 'companions') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" /><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M9 11a4 4 0 100-8 4 4 0 000 8zM20 8a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
  if (name === 'bookings') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7" /></svg>;
  if (name === 'chat') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
  if (name === 'wishlist') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 000-7.78z" /></svg>;
  if (name === 'payments') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 14h.01M17 14h.01" /></svg>;
  if (name === 'offers') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
  if (name === 'preferences') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 22a10 10 0 100-20 10 10 0 000 20z" /></svg>;
  if (name === 'help') return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 10a4 4 0 118 0c0 2-1.5 3-3 4" /><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" /></svg>;
  return null;
};

export default function Sidebar(){
  const pathname = usePathname();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(()=> {
    setName(localStorage.getItem('profileName') || 'User');
    setAvatar(localStorage.getItem('profileAvatar') || '');
    const onStorage = () => {
      setName(localStorage.getItem('profileName') || 'User');
      setAvatar(localStorage.getItem('profileAvatar') || '');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const initials = (name || 'User').split(' ').map(s=>s[0]||'').slice(0,2).join('').toUpperCase();

  const items = [
    { href: '/dashboard/profile', label: 'Profile', icon: 'profile' },
    { href: '/dashboard/companions', label: 'Companions', icon: 'companions' },
    { href: '/dashboard/bookings', label: 'Bookings', icon: 'bookings' },
    { href: '/dashboard/chat', label: 'Chat', icon: 'chat' },
    { href: '/dashboard/payment-methods', label: 'Payment Methods', icon: 'payments' },
    { href: '/dashboard/preferences', label: 'Preferences', icon: 'preferences' },
    { href: '/dashboard/help', label: 'Help', icon: 'help' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
        <div className="relative">
          {/* Avatar Circle */}
          <div className="h-14 w-14 rounded-xl overflow-hidden bg-gradient-to-br from-cyan-400 to-blue-500 text-white flex items-center justify-center font-bold text-lg shadow-md">
            {avatar ? (
              <img src={avatar} alt="avatar" className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {/* ID Badge */}
          <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
            #{Math.floor(Math.random() * 10000)}
          </div>
        </div>
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-slate-900 truncate" title={name}>
            {name}
          </div>
          <div className="text-xs text-slate-400">Member Account</div>
          <div className="text-xs font-semibold text-cyan-600 mt-1">Pro Member ✓</div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(i => {
          const active = pathname === i.href;
          return (
            <Link key={i.href} href={i.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${active ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-50'}`}>
              <span className={`p-2 rounded-md ${active ? 'bg-white/10' : 'bg-slate-100 text-slate-600'}`}>
                <Icon name={i.icon} />
              </span>
              <span className="truncate">{i.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
