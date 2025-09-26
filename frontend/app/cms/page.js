"use client"
import React, { useEffect } from 'react'
import './css/dashboard.css'
import { useCmsAuth } from "@/app/context/CmsAuthContext"
import { useRouter } from 'next/navigation'

function Page() {
  const { token, loading } = useCmsAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/cms/login");
    }
  }, [token, loading, router]);

  if (loading || !token) return null;

  return (
    <div>
      <h3>This is the Dashboard</h3>
    </div>
  )
}

export default Page