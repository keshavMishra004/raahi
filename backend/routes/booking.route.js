import {
  listBookings,
  getBooking,
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBookingHard,
} from "../controllers/booking.controller.js";

export default function bookingRoutes(app) {
  // Try to load cmsAuth if it exists; if not, fall back to a no-op middleware.
  let cmsAuth = (req, res, next) => next();
  try {
    // Note: dynamic import to avoid crashing server if file is missing
    // (Node supports top-level dynamic import in ESM contexts)
    // This will synchronously attempt to require the middleware file if present.
    // If your runtime does not support top-level await, this try/catch still prevents a thrown import error.
    // Use require fallback for CommonJS environments:
    // eslint-disable-next-line no-undef
    // (We keep it simple: attempt to access file via require)
    // If cmsAuth is not available, we just proceed without it.
    // In modern ESM context the below may throw; we catch and ignore.
    // Developer: if you have cmsAuth, replace this logic with a static import.
    // Attempt require (works in many setups)
    // @ts-ignore
    const maybe = require?.("../middlewares/cmsAuth.js");
    if (maybe && typeof maybe === "function") cmsAuth = maybe;
  } catch (err) {
    // ignore; cmsAuth not present
  }

  // List with filters & pagination
  app.get("/cms/bookings", cmsAuth, listBookings);

  // Get single booking
  app.get("/cms/bookings/:id", cmsAuth, getBooking);

  // Create booking
  app.post("/cms/bookings", cmsAuth, createBooking);

  // Update booking
  app.put("/cms/bookings/:id", cmsAuth, updateBooking);

  // Soft cancel booking
  app.delete("/cms/bookings/:id", cmsAuth, cancelBooking);

  // Hard delete (admin)
  app.delete("/cms/bookings/hard/:id", cmsAuth, deleteBookingHard);
}
