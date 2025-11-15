import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    email: { type: String },
    company: { type: String },
    service: { type: String, required: true },
    route: { type: String },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    pax: { type: Number, required: true },
    payment: { type: String, enum: ["Paid", "Partial", "Unpaid"], default: "Unpaid" },
    status: { type: String, enum: ["Confirmed", "Pending", "Cancelled", "Enquiry"], default: "Pending" },
    amount: { type: Number, default: 0 },
    aircraft: { type: String },
    operationalNotes: { type: String },
    manifest: [{ type: String }],
    bookingSource: { type: String },
    cancelledBy: { type: String },
    invoiceNumber: { type: String },
    invoiceAmount: { type: Number },
    extraCareNotes: { type: String },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
