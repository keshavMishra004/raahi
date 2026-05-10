const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Fly Bharat','Charter','Aerial Activity','Pilgrimage'], required: true },
  source: String,
  destination: String,
  location: String, // alternative to route
  datetime: Date,
  paymentStatus: { type: String, enum: ['Paid','Unpaid'], default: 'Unpaid' },
  bookingStatus: { type: String, enum: ['Pending','Confirmed','Completed','Cancelled'], default: 'Pending' },
  meta: mongoose.Schema.Types.Mixed
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
