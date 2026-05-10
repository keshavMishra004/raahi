const Companion = require('../models/Companion');

exports.create = async (req, res, next) => {
  try {
    const payload = { ...req.body, user: req.user._id };
    const c = await Companion.create(payload);
    res.json(c);
  } catch(err){ next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const list = await Companion.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(list);
  } catch(err){ next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const c = await Companion.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, req.body, { new: true });
    if(!c) return res.status(404).json({ message: 'Not found' });
    res.json(c);
  } catch(err){ next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const c = await Companion.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if(!c) return res.status(404).json({ message: 'Not found' });
    res.json({ ok: true });
  } catch(err){ next(err); }
};
