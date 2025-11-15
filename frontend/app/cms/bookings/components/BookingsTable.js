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
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left">Booking ID</th>
            <th className="p-3 text-left">Customer</th>
            <th className="p-3 text-left">Date & Time</th>
            <th className="p-3 text-left">Route</th>
            <th className="p-3 text-left">Service</th>
            <th className="p-3 text-left">PAX</th>
            <th className="p-3 text-left">Payment</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* SINGLE TBODY — render all rows inside this tbody */}
        <tbody>
          {loading && (
            <tr><td colSpan="9" className="p-6 text-center">Loading...</td></tr>
          )}

          {!loading && bookings.length === 0 && (
            <tr><td colSpan="9" className="p-6 text-center text-gray-500">No bookings</td></tr>
          )}

          {bookings.map((b) => (
            <Fragment key={b._id}>
              <tr className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{b.bookingId}</td>
                <td className="p-3">{b.customerName}</td>
                <td className="p-3">{new Date(b.date).toLocaleDateString()} {b.time}</td>
                <td className="p-3">{b.route}</td>
                <td className="p-3">{b.service}</td>
                <td className="p-3">{b.pax}</td>
                <td className="p-3">{b.payment}</td>
                <td className="p-3">{b.status}</td>
                <td className="p-3 text-center">
                  <ActionDropdown onToggle={() => toggleExpand(b._id)} onCancel={() => handleCancel(b._id)} />
                </td>
              </tr>

              {expandedId === b._id && (
                <tr>
                  <td colSpan="9" className="p-4 bg-gray-50">
                    <BookingsRowExpanded booking={b} />
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      <div className="p-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {bookings.length > 0 ? ((page - 1) * limit + 1) : 0} to {Math.min(page * limit, total)} of {total} bookings
        </div>
        <Pagination page={page} total={total} limit={limit} onPageChange={onPageChange} />
      </div>
    </div>
  );
}
