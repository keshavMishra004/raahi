"use client";
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

export default function BookingsFilters({ onApply, onReset, initialFilters = {} }) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [service, setService] = useState(initialFilters.service || "");
  const [status, setStatus] = useState(initialFilters.status || "");
  const [fromDate, setFromDate] = useState(initialFilters.fromDate || "");
  const [toDate, setToDate] = useState(initialFilters.toDate || "");
  const [showFilters, setShowFilters] = useState(false);

  const apply = () => {
    onApply({ search: search || undefined, service: service || undefined, status: status || undefined, fromDate: fromDate || undefined, toDate: toDate || undefined });
    setShowFilters(false);
  };

  const reset = () => {
    setSearch(""); setService(""); setStatus(""); setFromDate(""); setToDate("");
    if (onReset) onReset();
    setShowFilters(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8 border border-neutral-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <Filter size={20} className="text-sky-600 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-semibold text-sky-900">Advanced Filters</h3>
        </div>
        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden p-1 hover:bg-gray-100 rounded"
        >
          {showFilters ? <X size={20} /> : <Filter size={20} />}
        </button>
      </div>

      {/* Filters Grid - Hidden on mobile unless expanded */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          {/* Search Field */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Search Booking</label>
            <div className="relative h-10">
              <Search size={14} className="absolute left-3 top-3 text-neutral-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-full pl-8 sm:pl-9 pr-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm bg-neutral-50 hover:bg-white"
                placeholder="ID, name, email..."
              />
            </div>
          </div>

          {/* Service Select */}
          <div className="col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Service</label>
            <select value={service} onChange={(e) => setService(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm bg-neutral-50 hover:bg-white">
              <option value="">All Services</option>
              <option>Air Ambulance</option>
              <option>Private Charter</option>
              <option>Pilgrimage</option>
              <option>Udaan Flight</option>
              <option>Aerial Service</option>
            </select>
          </div>

          {/* Status Select */}
          <div className="col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm bg-neutral-50 hover:bg-white">
              <option value="">All Status</option>
              <option>Confirmed</option>
              <option>Pending</option>
              <option>Cancelled</option>
              <option>Enquiry</option>
            </select>
          </div>

          {/* From Date */}
          <div className="col-span-1 sm:col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">From</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm bg-neutral-50 hover:bg-white" />
          </div>

          {/* To Date */}
          <div className="col-span-1 sm:col-span-1">
            <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">To</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full h-10 px-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-xs sm:text-sm bg-neutral-50 hover:bg-white" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button onClick={reset} className="px-4 sm:px-6 py-2 sm:py-2.5 h-10 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium text-xs sm:text-base hover:bg-neutral-50 hover:border-neutral-400 transition-all duration-200 flex items-center justify-center">
            Reset
          </button>
          <button onClick={apply} className="px-4 sm:px-6 py-2 sm:py-2.5 h-10 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-lg font-medium text-xs sm:text-base hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
