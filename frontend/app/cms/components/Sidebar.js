"use client"
import Link from 'next/link.js'
import React from 'react'
import '../css/sidebar.css'

function Sidebar() {
  return (
    <section className='sidebar'>
        <Link href='/cms/'>Dashboard</Link>
        <Link href=''>Company Info</Link>
        <Link href=''>A/C Management</Link>
        <Link href=''>Services</Link>
        <Link href=''>Pricing</Link>
        <Link href=''>Bookings</Link>
        <Link href='/cms/policy'>Policy/FAQ/Reviews</Link>
    </section>
  )
}

export default Sidebar