"use client";
export default function BookingsRowExpanded({ booking }) {
  return (
    <div className="grid grid-cols-3 gap-4 text-sm">
      <div>
        <div className="text-xs text-gray-500">Booking Source</div>
        <div className="font-medium">{booking.bookingSource || "-"}</div>

        <div className="text-xs text-gray-500 mt-3">Manifest</div>
        <ul className="list-disc ml-4">
          {(booking.manifest || []).map((m, i) => <li key={i}>{m}</li>)}
        </ul>
      </div>

      <div>
        <div className="text-xs text-gray-500">Notes</div>
        <div className="whitespace-pre-wrap">{booking.operationalNotes || "-"}</div>

        <div className="text-xs text-gray-500 mt-3">Extra Care</div>
        <div>{booking.extraCareNotes || "-"}</div>
      </div>

      <div>
        <div className="text-xs text-gray-500">Amount</div>
        <div className="font-semibold">₹ {booking.amount || 0} {booking.invoiceNumber ? ` — Invoice: ${booking.invoiceNumber}` : ""}</div>

        <div className="text-xs text-gray-500 mt-3">Cancelled By</div>
        <div>{booking.cancelledBy || "-"}</div>
      </div>
    </div>
  );
}
