"use client";
import { useEffect, useState, useCallback } from "react";
import api from "@/utils/axios";
import AddManualBookingModal from "./AddManualBookingModal";
import BookingsFilters from "./components/BookingsFilters";
import BookingsTable from "./components/BookingsTable";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetch = useCallback(async (opts = {}) => {
    try {
      setLoading(true);
      const q = { page, limit, ...filters, ...opts };
      const { data } = await api.get("/cms/bookings", { params: q });
      if (data.success) {
        setBookings(data.bookings || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error("fetch bookings", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters]);

  useEffect(() => { fetch(); }, [fetch, page, filters]);

  const handleApplyFilters = (f) => {
    setPage(1);
    setFilters(f);
  };

  const handleResetFilters = () => {
    setFilters({});
    setPage(1);
  };

  const refresh = () => fetch();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 via-neutral-50 to-sky-100">
      <div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        
        {/* Header Card - Responsive */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md border-l-4 border-sky-600 mb-4 sm:mb-6 md:mb-8 p-3 sm:p-4 md:p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4 md:gap-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center bg-gradient-to-br from-sky-600 to-sky-400 rounded-lg text-white text-lg sm:text-2xl md:text-3xl shadow-md flex-shrink-0">
              ✈️
            </div>
            <div className="flex-1 sm:flex-none min-w-0">
              <h1 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-bold text-sky-900 m-0 truncate">Bookings Management</h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-0.5 sm:mt-1 md:mt-2 truncate">Centralized flight booking management system</p>
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 md:gap-4 mt-1 sm:mt-2 md:mt-4 text-xs text-neutral-500">
                <span className="truncate">📊 Total: <span className="font-semibold text-sky-700">{total}</span></span>
                <span className="hidden sm:inline truncate">✓ Active: <span className="font-semibold text-status-success">12</span></span>
              </div>
            </div>
          </div>
          <button onClick={() => setShowModal(true)} className="px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap w-full sm:w-auto text-xs sm:text-sm md:text-base">
            + New Booking
          </button>
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <BookingsFilters onApply={handleApplyFilters} onReset={handleResetFilters} initialFilters={filters} />
        </div>

        {/* Bookings Table - Scrollable on mobile */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <BookingsTable
            bookings={bookings}
            total={total}
            page={page}
            limit={limit}
            loading={loading}
            onPageChange={(p) => setPage(p)}
            onRefresh={refresh}
          />
        </div>

        {/* Modal */}
        {showModal && (
          <AddManualBookingModal
            onClose={() => setShowModal(false)}
            onSuccess={() => { setShowModal(false); fetch(); }}
          />
        )}
      </div>
    </div>
  );
}
