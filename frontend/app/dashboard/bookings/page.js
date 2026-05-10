"use client";
import React, { useEffect, useState } from "react";
import api from "../../../utils/api";

export default function BookingsPage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ type: "", bookingStatus: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) api.setAuthToken(token);
    load();
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/bookings/user", { params: filters });
      setItems(res.data || []);
    } catch (err) {
      try {
        const res = await api.rawGet("/bookings/user", {
          headers: api.defaults.headers,
          params: filters,
        });
        setItems(res.data || []);
      } catch (e) {
        setItems([]);
      }
    }
  };

  useEffect(() => {
    load();
  }, [filters]);

  const badgeClass = (s) => {
    if (s === "Confirmed")
      return "text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm";
    if (s === "Cancelled")
      return "text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm";
    if (s === "Completed")
      return "text-sky-700 bg-sky-50 px-3 py-1 rounded-full text-sm";
    return "text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm";
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-sky-600">My Bookings</h2>
          <div className="text-sm text-slate-500">Filter: Type / Status</div>
        </div>

        <div className="flex flex-wrap gap-3">
          {["All", "Pilgrimage", "Fly Bharat", "Charters", "Aerial Activity"].map(
            (t) => (
              <button
                key={t}
                onClick={() =>
                  setFilters({ ...filters, type: t === "All" ? "" : t })
                }
                className={`px-4 py-1 rounded-full text-sm ${
                  filters.type === t
                    ? "bg-cyan-600 text-white"
                    : "bg-white border border-gray-200 text-slate-600"
                }`}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="text-sm text-slate-500">No bookings found.</div>
        )}
        {items.map((b) => (
          <div
            key={b._id}
            className="bg-white rounded-2xl p-4 shadow flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-sm font-medium">
                {(b.type || "B")[0]}
              </div>
              <div>
                <div className="font-semibold text-slate-900">
                  {b.type}{" "}
                  {b.location
                    ? `— ${b.location}`
                    : `— ${b.source || ""} → ${b.destination || ""}`}
                </div>
                <div className="text-sm text-slate-500">
                  {new Date(b.datetime).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className={badgeClass(b.bookingStatus)}>{b.bookingStatus}</div>
              <div className="text-sm text-slate-500">{b.paymentStatus}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
