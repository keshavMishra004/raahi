"use client";
import { useState, Fragment } from "react";
import ActionDropdown from "./ActionDropdown";
import BookingsRowExpanded from "./BookingsRowExpanded";
import Pagination from "./Pagination";
import api from "@/utils/axios";

export default function BookingsTable({ bookings = [], total = 0, page = 1, limit = 5, loading = false, onPageChange, onRefresh }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => setExpandedId((prev) => (prev === id ? null : id));

  const handleCancel = async (id) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/cms/bookings/${id}`);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert("Failed to cancel");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Table wrapper with horizontal scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm">
          <thead className="bg-gradient-to-r from-sky-900 via-sky-800 to-sky-700 text-white font-semibold sticky top-0">
            <tr className="h-12 sm:h-14">
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Booking ID</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Customer</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Date & Time</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Route</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Service</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">PAX</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Payment</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-center text-xs font-bold uppercase tracking-wider whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {loading && (
              <tr className="h-16"><td colSpan="9" className="px-3 sm:px-6 py-4 text-center text-neutral-500 text-xs sm:text-sm">Loading bookings...</td></tr>
            )}

            {!loading && bookings.length === 0 && (
              <tr className="h-16"><td colSpan="9" className="px-3 sm:px-6 py-4 text-center text-neutral-500 text-xs sm:text-sm">No bookings found</td></tr>
            )}

            {bookings.map((b) => (
              <Fragment key={b._id}>
                <tr className="h-12 sm:h-14 hover:bg-sky-50 transition-colors duration-200 group">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-sky-700 whitespace-nowrap text-xs sm:text-sm">{b.bookingId}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-neutral-900 whitespace-nowrap hidden sm:table-cell text-xs sm:text-sm">{b.customerName}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-neutral-600 whitespace-nowrap text-xs sm:text-sm">{new Date(b.date).toLocaleDateString()} · {b.time}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-neutral-700 whitespace-nowrap hidden md:table-cell text-xs sm:text-sm">{b.route}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-neutral-700 font-medium whitespace-nowrap hidden lg:table-cell text-xs sm:text-sm">{b.service}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-semibold text-center text-sky-700 whitespace-nowrap text-xs sm:text-sm">{b.pax}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell"><span className={getPaymentBadge(b.payment)}>{b.payment}</span></td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4"><span className={getStatusBadge(b.status)}>{b.status}</span></td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ActionDropdown onToggle={() => toggleExpand(b._id)} onCancel={() => handleCancel(b._id)} />
                  </td>
                </tr>

                {expandedId === b._id && (
                  <tr>
                    <td colSpan="9" className="px-3 sm:px-6 py-4 sm:py-6 bg-gradient-to-r from-sky-50 to-neutral-50 border-l-4 border-sky-400">
                      <BookingsRowExpanded booking={b} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between border-t border-neutral-200 bg-neutral-50 gap-2 sm:gap-4 h-auto sm:h-16 text-xs sm:text-sm">
        <div className="text-neutral-600 text-center sm:text-left">
          Showing <span className="font-semibold text-sky-700">{bookings.length > 0 ? ((page - 1) * limit + 1) : 0}</span> to <span className="font-semibold text-sky-700">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-sky-700">{total}</span> bookings
        </div>
        <Pagination page={page} total={total} limit={limit} onPageChange={onPageChange} />
      </div>
    </div>
  );
}

const getStatusBadge = (status) => {
  const badges = {
    "Confirmed": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-success-light text-status-success border border-green-200",
    "Pending": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-warning-light text-status-warning border border-amber-200",
    "Cancelled": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-error-light text-status-error border border-red-200",
    "Enquiry": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-info-light text-status-info border border-blue-200"
  };
  return badges[status] || "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700";
};

const getPaymentBadge = (payment) => {
  const badges = {
    "Paid": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-success-light text-status-success border border-green-200",
    "Partial": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-warning-light text-status-warning border border-amber-200",
    "Unpaid": "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-status-error-light text-status-error border border-red-200"
  };
  return badges[payment] || "inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-700";
};
