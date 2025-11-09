"use client"
import Link from 'next/link' // fixed: was 'next/link.js'
import React from 'react'
import '../css/sidebar.css'
import { useCmsAuth } from "@/app/context/CmsAuthContext"

function Sidebar() {
  const { logout } = useCmsAuth();

  return (
    <section className='sidebar'>
        <Link href='/cms'>Dashboard</Link>
        <Link href='/cms/company'>Company Info</Link> {/* was empty href */}
        <Link href='/cms/aircraft'>A/C Management</Link> {/* was empty href */}
        <Link href='#'>Services</Link> {/* was empty href */}
        <Link href='/cms/pricing'>Pricing</Link> {/* was empty href */}
        <Link href='#'>Bookings</Link> {/* was empty href */}
        <Link href='/cms/policy'>Policy/FAQ/Reviews</Link>
        <span
          onClick={logout}
          className="mt-4 w-full block text-left text-red-600 hover:underline cursor-pointer"
        >
          Logout
        </span>
    </section>
  )
}

export default Sidebar