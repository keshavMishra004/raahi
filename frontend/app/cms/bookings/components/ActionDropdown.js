"use client";
import { useState } from "react";
import { MoreVertical, Eye, X } from "lucide-react";

export default function ActionDropdown({ onToggle, onCancel }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button 
        onClick={() => { setOpen(!open); onToggle && onToggle(); }} 
        className="p-2 border border-neutral-300 rounded-lg hover:bg-sky-50 hover:border-sky-400 transition-all duration-200 text-neutral-600 hover:text-sky-700"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 min-w-[180px] overflow-hidden">
          <button 
            className="w-full text-left px-4 py-3 text-sm text-neutral-700 hover:bg-sky-50 hover:text-sky-900 transition-colors border-b border-neutral-100 font-medium flex items-center gap-2"
          >
            <Eye size={16} /> View Details
          </button>
          <button 
            onClick={() => { 
              if (confirm("Cancel this booking?")) {
                setOpen(false);
                onCancel && onCancel();
              }
            }} 
            className="w-full text-left px-4 py-3 text-sm text-status-error hover:bg-status-error-light hover:text-red-900 transition-colors font-medium flex items-center gap-2"
          >
            <X size={16} /> Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}
