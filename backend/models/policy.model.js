import mongoose from "mongoose";

const policySchema = new mongoose.Schema({
  operator: {
    type: mongoose.Schema.Types.ObjectId, // operator_id
    ref: "Operator",
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId, // service_id
    ref: "Service",
    default: null, // null = global fallback
  },
  cancellationPolicy: {
    type: String,
    required: true,
  },
  weatherPolicy: {
    type: String,
    required: true,
  },
}, { timestamps: true });

// Enforce uniqueness: one operator can only have ONE global policy
// and one policy per service
policySchema.index({ operator: 1, service: 1 }, { unique: true });

const Policymodel = mongoose.model("Policy", policySchema);

export default Policymodel;
