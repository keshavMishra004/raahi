import mongoose from "mongoose";

const aircraftSchema = new mongoose.Schema({
  operatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Operator",
    required: false // allow null for now, set in controller if available
  },
  registration: { type: String, required: true, unique: true },  // e.g. VT-JAI
  model: { type: String, required: true }, // e.g. Cessna Citation XLS
  type: { type: String, required: true },  // e.g. Helicopter / Jet
  crewCapacity: { type: Number, required: true },
  passengerCapacity: { type: Number, required: true },
  base: { type: String, required: true },  // ICAO airport code
  status: { 
    type: String, 
    enum: ["In Service", "Under Maintenance", "Retired"], 
    default: "In Service" 
  }
}, { timestamps: true });

export default mongoose.model("Aircraft", aircraftSchema);
