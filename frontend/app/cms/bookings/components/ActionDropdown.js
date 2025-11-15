"use client";
import { useState } from "react";

export default function ActionDropdown({ onToggle, onCancel }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      <button onClick={() => { setOpen(!open); onToggle && onToggle(); }} className="px-2 py-1 border rounded">⋮</button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white border rounded shadow-sm z-20">
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50">Edit</button>
          <button className="w-full text-left px-3 py-2 hover:bg-gray-50" onClick={() => { if (confirm("Are you sure you want to delete?")) onCancel && onCancel(); }}>Cancel Booking</button>
        </div>
      )}
    </div>
  );
}
