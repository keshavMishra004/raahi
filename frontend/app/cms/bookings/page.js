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
    <div className="p-6 min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Bookings Management</h1>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Manual Booking</button>
      </div>

      <BookingsFilters onApply={handleApplyFilters} onReset={handleResetFilters} initialFilters={filters} />

      <div className="mt-4">
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

      {showModal && (
        <AddManualBookingModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetch(); }}
        />
      )}
    </div>
  );
}
