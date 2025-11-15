import Booking from "../models/booking.model.js";

// simple bookingId generator
const genBookingId = () => `BK${Date.now().toString().slice(-8)}`;

export const listBookings = async (req, res) => {
  try {
    const {
      search,
      service,
      status,
      fromDate,
      toDate,
      page = 1,
      limit = 5,
      sortBy = "createdAt",
      sortDir = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const lim = Math.max(1, parseInt(limit));

    const filter = { isDeleted: false };

    if (service) filter.service = service;
    if (status) filter.status = status;

    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    if (search) {
      const s = new RegExp(search.trim(), "i");
      filter.$or = [
        { bookingId: s },
        { customerName: s },
        { email: s },
        { company: s },
        { route: s },
      ];
    }

    const sortObj = { [sortBy]: sortDir === "asc" ? 1 : -1 };

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort(sortObj)
      .skip((pageNum - 1) * lim)
      .limit(lim)
      .lean();

    res.json({ success: true, bookings, total, page: pageNum, limit: lim });
  } catch (err) {
    console.error("listBookings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id).lean();
    if (!booking || booking.isDeleted) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    console.error("getBooking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.customerName || !payload.service || !payload.date || !payload.time || !payload.pax) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const booking = new Booking({
      bookingId: payload.bookingId || genBookingId(),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      email: payload.email,
      company: payload.company,
      service: payload.service,
      route: payload.route || "Not Applicable",
      date: new Date(payload.date),
      time: payload.time,
      pax: Number(payload.pax),
      payment: payload.payment || "Unpaid",
      status: payload.status || "Pending",
      amount: Number(payload.amount) || 0,
      aircraft: payload.aircraft,
      operationalNotes: payload.operationalNotes,
      manifest: payload.manifest || [],
      bookingSource: payload.bookingSource || "Manual",
      invoiceNumber: payload.invoiceNumber,
      invoiceAmount: payload.invoiceAmount,
      extraCareNotes: payload.extraCareNotes,
    });

    await booking.save();
    res.status(201).json({ success: true, booking });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const booking = await Booking.findByIdAndUpdate(id, payload, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    console.error("updateBooking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const cancelledBy = req.user?.id || req.user?.email || "system";
    const booking = await Booking.findByIdAndUpdate(id, { status: "Cancelled", cancelledBy }, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (err) {
    console.error("cancelBooking error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteBookingHard = async (req, res) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteBookingHard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
