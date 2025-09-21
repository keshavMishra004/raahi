"use client"
import React from 'react'
import '../css/navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo or Title */}
        <span className="navbar-logo">Raahi</span>
        {/* Navigation links (add as needed) */}
        {/* <a href="#">Home</a> */}
      </div>
      <div className="navbar-right">
        {/* Notification Bell */}
        <span className="navbar-bell">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.7 1.7A1 1 0 005 20h14a1 1 0 00.7-1.7L18 16z" fill="#222"/>
          </svg>
        </span>
        {/* Company Name and Operator Code */}
        <span className="navbar-company">
          User company name<br />
          <span className="navbar-operator">operator code</span>
        </span>
        {/* User Avatar */}
        <span className="navbar-avatar">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="#888"/>
            <path d="M4 20c0-4 8-4 8-4s8 0 8 4" fill="#888"/>
          </svg>
        </span>
      </div>
    </nav>
  )
}

export default Navbar