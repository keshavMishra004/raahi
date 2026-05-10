const mongoose = require('mongoose');

const CompanionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  middleName: String,
  lastName: String,
  email: String,
  nationality: String,
  aadharNumber: String,
  passportNumber: String,
  age: Number,
  height: { value: Number, unit: { type: String, enum: ['cm','ft'], default: 'cm' } },
  weight: { value: Number, unit: { type: String, enum: ['kg','lbs'], default: 'kg' } }
}, { timestamps: true });

module.exports = mongoose.model('Companion', CompanionSchema);
