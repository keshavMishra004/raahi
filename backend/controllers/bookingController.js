const Booking = require('../models/Booking');

exports.listForUser = async (req, res, next) => {
  try {
    const q = { user: req.user._id };
    if(req.query.type) q.type = req.query.type;
    if(req.query.bookingStatus) q.bookingStatus = req.query.bookingStatus;
    const items = await Booking.find(q).sort({ datetime: -1 });
    res.json(items);
  } catch(err){ next(err); }
};

// Admin-only: PUT /api/bookings/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const b = await Booking.findById(req.params.id);
    if(!b) return res.status(404).json({ message: 'Not found' });
    b.bookingStatus = req.body.bookingStatus;
    await b.save();
    res.json(b);
  } catch(err){ next(err); }
};
