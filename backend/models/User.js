const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PreferenceSchema = new mongoose.Schema({
  preferredAirlines: [String],
  seatPreference: { type: String, enum: ['Window','Aisle','Middle','No Preference'], default: 'No Preference' },
  mealPreference: { type: String, enum: ['Veg','Non-Veg','Vegan','Jain','No Preference'], default: 'No Preference' },
  notifications: {
    onsite: { type: Boolean, default: true },
    browser: { type: Boolean, default: false },
    email: { type: Boolean, default: true }
  }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneCode: String,
  phone: String,
  password: { type: String, required: true },
  dob: Date,
  gender: String,
  nationality: String,
  weight: { value: Number, unit: { type: String, enum: ['kg','lbs'], default: 'kg' } },
  height: { value: Number, unit: { type: String, enum: ['cm','ft'], default: 'cm' } },
  healthConditions: [String],
  role: { type: String, enum: ['user','admin'], default: 'user' },
  preferences: PreferenceSchema,
  avatarUrl: { type: String } // <-- new: stores image URL or base64 data URI
}, { timestamps: true });

UserSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function(candidate){
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
