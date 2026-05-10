const User = require('../models/User');

// GET /api/user/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch(err){ next(err); }
};

// PUT /api/user/me
exports.updateMe = async (req, res, next) => {
  try {
    // fields we allow to update directly
    const allowed = ['fullName','phoneCode','phone','dob','gender','nationality','weight','height','healthConditions','avatarUrl'];
    const updates = {};
    allowed.forEach(k => {
      if (typeof req.body[k] !== 'undefined') updates[k] = req.body[k];
    });

    // If password change requested, load doc and set password to trigger hashing in pre-save
    if (req.body.password) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      // apply other updates
      Object.assign(user, updates);
      user.password = req.body.password;
      await user.save(); // pre-save will hash password
      const safe = user.toObject();
      delete safe.password;
      return res.json(safe);
    } else {
      const updated = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
      res.json(updated);
    }
  } catch(err){ next(err); }
};
