"use client";
import React, { useEffect } from "react";
import { useCmsAuth } from "@/app/context/CmsAuthContext";
import { useRouter } from "next/navigation";
import { Edit2, User } from "lucide-react";

export default function ProfilePage() {
  const { token, loading, user } = useCmsAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) router.replace("/cms/login");
  }, [token, loading, router]);

  if (loading || !token) return null;

  // sample user fallback if context doesn't provide fields
  const u = user || {
    name: "Rishabh Singh Chandra",
    email: "rscdcjnff@gmail.com",
    phone: "+91 27834 87048",
    dob: "2001-03-02",
    gender: "Male",
    nationality: "Indian",
    weight: "70",
    height: "5",
    health: "Asthma, condition1, condition2"
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-neutral-50 to-sky-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-600 to-sky-400 flex items-center justify-center text-white shadow-lg">
              <User size={36} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-sky-900">{u.name}</h1>
              <p className="text-sm text-neutral-600 mt-1">Member since 2023 • {u.nationality}</p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-full shadow hover:shadow-lg transition">
            <Edit2 size={16}/> Edit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Personal details */}
          <section className="bg-white rounded-xl shadow p-6 border border-neutral-100">
            <h2 className="text-lg font-semibold text-sky-900 mb-4">Personal details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email Address" value={u.email} />
              <Field label="Phone no" value={u.phone} />
              <Field label="Password" value={"••••••••••"} mask />
              <Field label="Date of Birth" value={new Date(u.dob).toLocaleDateString()} />
              <Field label="Gender" value={u.gender} />
              <Field label="Nationality" value={u.nationality} />
            </div>
          </section>

          {/* Physical & Health */}
          <section className="bg-white rounded-xl shadow p-6 border border-neutral-100">
            <h2 className="text-lg font-semibold text-sky-900 mb-4">Physical & Health details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="flex items-center gap-3">
                <label className="text-sm text-neutral-700 w-28">Weight:</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={u.weight} className="w-20 h-10 px-3 rounded border border-neutral-200 bg-neutral-50 text-sm" />
                  <select className="h-10 rounded border border-neutral-200 bg-white px-2">
                    <option>kg</option>
                    <option>lbs</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-neutral-700 w-28">Height:</label>
                <div className="flex items-center gap-2">
                  <input readOnly value={u.height} className="w-20 h-10 px-3 rounded border border-neutral-200 bg-neutral-50 text-sm" />
                  <select className="h-10 rounded border border-neutral-200 bg-white px-2">
                    <option>ft</option>
                    <option>cm</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="text-sm text-neutral-700 block mb-2">Health Condition:</label>
                <input readOnly value={u.health} className="w-full h-10 px-4 rounded border border-neutral-200 bg-neutral-50 text-sm" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mask }) {
  return (
    <div>
      <div className="text-sm text-neutral-600 mb-1">{label}</div>
      <div className="text-sm font-medium text-sky-900">
        {mask ? value : value || "—"}
      </div>
    </div>
  );
}
