// import mongoose from "mongoose";

// const aircraftSchema = new mongoose.Schema({
//   operatorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Operator",
//     required: false // allow null for now, set in controller if available
//   },
//   registration: { 
//     type: String, 
//     required: true, 
//     unique: true 
//   },  // e.g. VT-JAI
//   model: { 
//     type: String, 
//     required: true 
//   }, // e.g. Cessna Citation XLS
//   type: { 
//     type: String, 
//     required: true 
//   },  // e.g. Helicopter / Jet
//   crewCapacity: { 
//     type: Number, 
//     required: true 
//   },
//   passengerCapacity: { 
//     type: Number, 
//     required: true 
//   },
//   base: { 
//     type: String, 
//     required: true 
//   },  // ICAO airport code
//   status: { 
//     type: String, 
//     enum: ["In Service", "Under Maintenance", "Retired"], 
//     default: "In Service" 
//   }
// }, { timestamps: true });

// export default mongoose.model("Aircraft", aircraftSchema);

import mongoose from "mongoose";

// ==========================
// STEP 5: Service Config Schema
// ==========================
const ServiceConfigurationSchema = new mongoose.Schema(
  {
    airAmbulance: {
      stretcherCapacity: String,
      medevacCertified: String,
      ventilator: Boolean,
      ecgMachine: Boolean,
      incubator: Boolean,
    },
    privateCharter: {
      maxRange: String,
      cruiseSpeed: String,
      inflightwifi: Boolean,
      lavatory: Boolean,
      galley: Boolean,
    },
    pilgrimage: {
      highAltitudeKit: Boolean,
      dgcaApproval: String,
    },
    udaanFlight: {
      rcsRouteApproval: String,
      subsidyCategory: String,
    },
    aerialService: {
      capacity: String,
      equipmentStandards: String,
    },
  },
  { _id: false }
);

// ==========================
// STEP 4: Seat Config Schema
// ==========================
const SeatSchema = new mongoose.Schema(
  {
    row: Number,
    col: String,
    type: String,
  },
  { _id: false }
);

const SeatConfigSchema = new mongoose.Schema(
  {
    totalRows: Number,
    seatPattern: String,
    seats: [SeatSchema],
  },
  { _id: false }
);

// ==========================
// MAIN AIRCRAFT SCHEMA
// ==========================
const aircraftSchema = new mongoose.Schema(
  {
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operator",
      required: false,
    },

    // STEP 1
    registration: { type: String, required: true, unique: true },
    model: { type: String, required: true },
    category: { type: String },
    type: { type: String, required: true },
    customType: String,
    crewCapacity: { type: Number, required: true },
    passengerCapacity: { type: Number, required: true },
    base: { type: String, required: true },
    status: {
      type: String,
      enum: ["In Service", "Under Maintenance", "Retired"],
      default: "In Service",
    },

    // STEP 2
    makeYear: String,
    registrationYear: String,
    dgcaCertificate: String,
    range: String,
    cruiseSpeed: String,
    serviceCeiling: String,
    takeoffDistance: String,
    landingDistance: String,
    rateOfClimb: String,
    maxTakeoffWeight: String,
    fuelCapacity: String,
    minCrew: Number,
    pressurizedCabin: Boolean,
    cabinHeight: String,
    baggageCapacity: String,
    baggageDimensions: String,
    secondaryBases: [String],
    availabilityStatus: {
      type: String,
      enum: ["Active", "Under Maintenance", "Seasonal"],
      default: "Active",
    },
    photos: [String],
    photoTags: [String],
    amenities: [String],
    amenitiesOther: String,
    entertainment: String,
    foodService: String,
    flightAttendant: String,
    lavatory: String,
    lavatoryType: String,
    shortDescription: String,
    detailedDescription: String,
    additionalNotes: String,

    // STEP 3
    services: [String],

    // STEP 4
    seatConfig: SeatConfigSchema,

    // STEP 5
    serviceConfigurations: ServiceConfigurationSchema,
  },
  { timestamps: true }
);

export default mongoose.model("Aircraft", aircraftSchema);
