"use client";
import { useState } from "react";

export default function BookingsFilters({ onApply, onReset, initialFilters = {} }) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [service, setService] = useState(initialFilters.service || "");
  const [status, setStatus] = useState(initialFilters.status || "");
  const [fromDate, setFromDate] = useState(initialFilters.fromDate || "");
  const [toDate, setToDate] = useState(initialFilters.toDate || "");

  const apply = () => {
    onApply({ search: search || undefined, service: service || undefined, status: status || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined });
  };

  const reset = () => {
    setSearch(""); setService(""); setStatus(""); setFromDate(""); setToDate("");
    if (onReset) onReset();
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm flex items-end gap-3 flex-wrap">
      <div className="flex-1 min-w-[180px]">
        <label className="text-xs text-gray-500">Search</label>
        <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Booking ID, name, email, company..." />
      </div>
      <div className="w-44">
        <label className="text-xs text-gray-500">Service</label>
        <select value={service} onChange={(e) => setService(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="">Any</option>
          <option>Air Ambulance</option>
          <option>Private Charter</option>
          <option>Pilgrimage</option>
          <option>Udaan Flight</option>
          <option>Aerial Service</option>
        </select>
      </div>
      <div className="w-40">
        <label className="text-xs text-gray-500">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded px-3 py-2">
          <option value="">Any</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Cancelled</option>
          <option>Enquiry</option>
        </select>
      </div>

      <div>
        <label className="text-xs text-gray-500">From</label>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border rounded px-3 py-2" />
      </div>
      <div>
        <label className="text-xs text-gray-500">To</label>
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border rounded px-3 py-2" />
      </div>

      <div className="ml-auto flex gap-2">
        <button onClick={reset} className="px-4 py-2 border rounded">Reset</button>
        <button onClick={apply} className="px-4 py-2 bg-blue-600 text-white rounded">Apply</button>
      </div>
    </div>
  );
}
