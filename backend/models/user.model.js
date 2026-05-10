import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    /* ===== PROFILE FIELDS ===== */
    phoneCode: String,
    phone: String,
    dob: String,
    gender: String,
    nationality: String,
    weight: String,
    weightUnit: String,
    height: String,
    heightUnit: String,
    health: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

