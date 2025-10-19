"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { X, Plane } from "lucide-react";
import api from "@/utils/axios";

export default function AddAircraftForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Step 1 fields
    registration: "",
    model: "",
    category: "",
    type: "",
    customType: "",
    crewCapacity: "",
    passengerCapacity: "",
    base: "",
    status: "In Service",
    // Step 2 fields
    makeYear: "",
    registrationYear: "",
    dgcaCertificate: null,
    range: "",
    cruiseSpeed: "",
    serviceCeiling: "",
    takeoffDistance: "",
    landingDistance: "",
    rateOfClimb: "",
    maxTakeoffWeight: "",
    fuelCapacity: "",
    minCrew: "",
    pressurizedCabin: false,
    cabinHeight: "",
    baggageCapacity: "",
    baggageDimensions: "",
    secondaryBases: [],
    availabilityStatus: "Active",
    photos: [],
    photoTags: [],
    amenities: [],
    amenitiesOther: "",
    entertainment: "",
    foodService: "",
    flightAttendant: "",
    lavatory: "",
    lavatoryType: "",
    shortDescription: "",
    detailedDescription: "",
    additionalNotes: "",
    // Step 3 fields
    services: [],
  });
  const [error, setError] = useState("");

  const categories = {
    "Fixed-Wing Aircraft": [
      "Single Engine Piston",
      "Multi Engine Piston",
      "Light Jet",
      "Midsize Jet",
      "Heavy Jet",
      "Narrow-body Airliner",
      "Wide-body Airliner",
    ],
    Helicopters: ["Light Helicopter", "Twin Engine Helicopter", "Heavy Helicopter"],
    "Lighter-Than-Air": ["Hot Air Balloon", "Airship / Blimp"],
    "Gliders & Non-Powered": ["Glider", "Paraglider"],
    Other: [],
  };

  // Generate years for dropdown (e.g., 1980 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 45 }, (_, i) => `${currentYear - i}`);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setForm((prev) => {
      const arr = prev[name] || [];
      return {
        ...prev,
        [name]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  };

  const handlePhotoUpload = (e) => {
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...Array.from(e.target.files)],
    }));
  };

  const handleStep1Next = () => {
    setError("");
    // Optionally validate step 1 fields here
    setStep(2);
  };

  const handleStep2Next = () => {
    setError("");
    // Optional: validate required step 2 fields here
    setStep(3);
  };

  const handleStep2Back = () => setStep(1);

  const handleStep3Back = () => setStep(2);

  const handleSubmit = async () => {
    setError("");
    try {
      // Prepare payload (handle file uploads as needed)
      const payload = {
        ...form,
        type: form.category === "Other" ? form.customType : form.type,
        crewCapacity: Number(form.crewCapacity),
        passengerCapacity: Number(form.passengerCapacity),
        minCrew: Number(form.minCrew),
        pressurizedCabin: !!form.pressurizedCabin,
        // ...other conversions as needed...
      };
      // If you need to upload files, use FormData
      const fd = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        if (Array.isArray(v)) {
          v.forEach((item) => fd.append(k, item));
        } else if (v instanceof File) {
          fd.append(k, v);
        } else {
          fd.append(k, v ?? "");
        }
      });
      await api.post("/cms/aircraft", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add aircraft");
    }
  };

  const progressWidth = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-[650px] rounded-2xl shadow-2xl border border-white/20 
                   bg-gradient-to-br from-indigo-50/90 via-white/90 to-blue-50/80 
                   dark:from-slate-800/80 dark:to-slate-900/90 
                   backdrop-blur-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <div className="flex items-center gap-3">
            <Plane className="text-blue-600 dark:text-blue-400" size={28} />
            <div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
                {step === 1
                  ? "Add New Aircraft"
                  : step === 2
                  ? "Aircraft Specs & Details"
                  : "Assign Services"}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                {step === 1
                  ? "Fill in the details below to register a new aircraft."
                  : step === 2
                  ? "Enter technical specs, amenities, and upload photos."
                  : "Select all operational roles this aircraft is certified for."}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-200 dark:bg-slate-700">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: progressWidth }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
          ></motion.div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded-md text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            // ...existing step 1 UI...
            <div className="grid grid-cols-2 gap-4">
              <FloatingInput
                label="Registration No."
                name="registration"
                value={form.registration}
                onChange={handleChange}
              />
              <FloatingInput
                label="Model"
                name="model"
                value={form.model}
                onChange={handleChange}
              />

              <FloatingSelect
                label="Category"
                name="category"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value, type: "", customType: "" })
                }
                options={Object.keys(categories)}
              />

              {form.category && form.category !== "Other" ? (
                <FloatingSelect
                  label="Type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  options={categories[form.category]}
                />
              ) : form.category === "Other" ? (
                <FloatingInput
                  label="Custom Type"
                  name="customType"
                  value={form.customType}
                  onChange={handleChange}
                />
              ) : (
                <FloatingInput label="Select category first" disabled />
              )}

              <FloatingInput
                label="Crew Capacity"
                name="crewCapacity"
                type="number"
                value={form.crewCapacity}
                onChange={handleChange}
              />
              <FloatingInput
                label="Passenger Capacity"
                name="passengerCapacity"
                type="number"
                value={form.passengerCapacity}
                onChange={handleChange}
              />
              <FloatingInput
                label="Base Airport (ICAO)"
                name="base"
                value={form.base}
                onChange={handleChange}
              />

              <FloatingSelect
                label="Status"
                name="status"
                value={form.status}
                onChange={handleChange}
                options={["In Service", "Under Maintenance", "Retired"]}
              />
            </div>
          ) : step === 2 ? (
            // ...existing step 2 UI...
            <div className="space-y-6">
              {/* Identification & Certification */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">
                  Identification & Certification
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {/* Make Year Dropdown */}
                  <FloatingSelect
                    label="Make Year"
                    name="makeYear"
                    value={form.makeYear}
                    onChange={handleChange}
                    options={years}
                  />
                  {/* Registration Year Dropdown */}
                  <FloatingSelect
                    label="Year of Registration"
                    name="registrationYear"
                    value={form.registrationYear}
                    onChange={handleChange}
                    options={years}
                  />
                  {/* Styled File Input */}
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-600 mb-1">
                      DGCA Certificate of Airworthiness
                    </label>
                    <label className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                      <span className="text-blue-700 font-medium">
                        {form.dgcaCertificate?.name || "Choose File"}
                      </span>
                      <input
                        type="file"
                        name="dgcaCertificate"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                    {form.dgcaCertificate && (
                      <span className="text-xs text-slate-500 ml-2">
                        Selected: {form.dgcaCertificate.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Performance & Technical Specs */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">
                  Performance & Technical Specs
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Range (NM/KM)"
                    name="range"
                    value={form.range}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Cruise Speed (knots/kmph)"
                    name="cruiseSpeed"
                    value={form.cruiseSpeed}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Service Ceiling (ft)"
                    name="serviceCeiling"
                    value={form.serviceCeiling}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Takeoff Distance (m)"
                    name="takeoffDistance"
                    value={form.takeoffDistance}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Landing Distance (m)"
                    name="landingDistance"
                    value={form.landingDistance}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Rate of Climb (ft/min)"
                    name="rateOfClimb"
                    value={form.rateOfClimb}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Max Takeoff Weight (Kg)"
                    name="maxTakeoffWeight"
                    value={form.maxTakeoffWeight}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Fuel Capacity (Gallons/Kg)"
                    name="fuelCapacity"
                    value={form.fuelCapacity}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Capacity & Layout */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">
                  Capacity & Layout
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Minimum Crew Required"
                    name="minCrew"
                    type="number"
                    value={form.minCrew}
                    onChange={handleChange}
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="pressurizedCabin"
                      checked={form.pressurizedCabin}
                      onChange={handleChange}
                      id="pressurizedCabin"
                    />
                    <label
                      htmlFor="pressurizedCabin"
                      className="text-sm text-slate-600"
                    >
                      Pressurized Cabin
                    </label>
                  </div>
                  <FloatingInput
                    label="Cabin Height (ft/m)"
                    name="cabinHeight"
                    value={form.cabinHeight}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Baggage Capacity (Kg)"
                    name="baggageCapacity"
                    value={form.baggageCapacity}
                    onChange={handleChange}
                  />
                  <FloatingInput
                    label="Baggage Dimensions"
                    name="baggageDimensions"
                    value={form.baggageDimensions}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {/* Base & Availability */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">
                  Base & Availability
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput
                    label="Secondary Base(s)"
                    name="secondaryBases"
                    value={form.secondaryBases}
                    onChange={handleChange}
                  />
                  <FloatingSelect
                    label="Availability Status"
                    name="availabilityStatus"
                    value={form.availabilityStatus}
                    onChange={handleChange}
                    options={["Active", "Under Maintenance", "Seasonal"]}
                  />
                </div>
              </div>
              {/* Media & Photos */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Media & Photos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Upload Photos</label>
                    <input type="file" multiple onChange={handlePhotoUpload} className="block w-full text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {["Exterior", "Interior", "Lobby", "Pantry", "Cockpit", "Seating", "Baggage Hold", "Medical Setup", "Branding/Logo"].map((tag) => (
                        <label key={tag} className="flex items-center gap-1 text-xs">
                          <input type="checkbox" checked={form.photoTags.includes(tag)} onChange={() => handleMultiSelect("photoTags", tag)} />
                          {tag}
                        </label>
                      ))}
                      <input type="text" name="photoTagsOther" placeholder="Other" className="border rounded px-2 py-1 text-xs" onBlur={(e) => e.target.value && handleMultiSelect("photoTags", e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Cabin Amenities & Services */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Cabin Amenities & Services</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-600 mb-1">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {["Air Conditioning", "Wi-Fi", "In-flight Catering", "Medical Stretcher"].map((am) => (
                        <label key={am} className="flex items-center gap-1 text-xs">
                          <input type="checkbox" checked={form.amenities.includes(am)} onChange={() => handleMultiSelect("amenities", am)} />
                          {am}
                        </label>
                      ))}
                      <input type="text" name="amenitiesOther" placeholder="Other" className="border rounded px-2 py-1 text-xs" value={form.amenitiesOther} onChange={handleChange} />
                    </div>
                  </div>
                  <FloatingInput label="Entertainment" name="entertainment" value={form.entertainment} onChange={handleChange} />
                  <FloatingSelect label="Food Service" name="foodService" value={form.foodService} onChange={handleChange} options={["Snacks", "Hot Meals", "None"]} />
                  <FloatingInput label="Flight Attendant (Yes/No + Number)" name="flightAttendant" value={form.flightAttendant} onChange={handleChange} />
                  <FloatingInput label="Lavatory (Number)" name="lavatory" value={form.lavatory} onChange={handleChange} />
                  <FloatingInput label="Lavatory Type" name="lavatoryType" value={form.lavatoryType} onChange={handleChange} />
                </div>
              </div>
              {/* Description & Notes */}
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Description & Notes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Short Description" className="border rounded px-3 py-2 w-full" />
                  <textarea name="detailedDescription" value={form.detailedDescription} onChange={handleChange} placeholder="Detailed Description" className="border rounded px-3 py-2 w-full" />
                  <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} placeholder="Additional Notes (Private)" className="border rounded px-3 py-2 w-full col-span-2" />
                </div>
              </div>
            </div>
          ) : (
            // Step 3: Assign Services
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Air Ambulance", "Private Charter", "Pilgrimage", "Udaan Flight", "Aerial Service"].map((service) => (
                <label
                  key={service}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    form.services.includes(service)
                      ? "bg-blue-50 border-blue-300 text-blue-800"
                      : "border-gray-200 text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-0"
                    checked={form.services.includes(service)}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        services: prev.services.includes(service)
                          ? prev.services.filter((s) => s !== service)
                          : [...prev.services, service],
                      }))
                    }
                  />
                  <span className="text-base font-medium">{service}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-end gap-3 border-t border-white/20">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 
                       hover:bg-slate-100 transition"
            >
              ← Back
            </button>
          )}

          {step === 1 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStep1Next}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white font-semibold shadow-md hover:shadow-lg transition"
            >
              Next →
            </motion.button>
          )}

          {step === 2 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleStep2Next}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white font-semibold shadow-md hover:shadow-lg transition"
            >
              Next →
            </motion.button>
          )}

          {step === 3 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
                         text-white font-semibold shadow-md hover:shadow-lg transition"
            >
              Save Aircraft
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* Floating Label Input */
function FloatingInput({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        className={`peer w-full border border-slate-300 dark:border-slate-600 bg-transparent 
        rounded-lg px-3 pt-5 pb-2 text-slate-800 dark:text-white 
        focus:ring-2 focus:ring-blue-400 outline-none transition`}
      />
      <label
        className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 
                   transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-slate-400 
                   peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
}

/* Floating Label Select */
function FloatingSelect({ label, options = [], ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="peer w-full border border-slate-300 dark:border-slate-600 bg-transparent 
                   rounded-lg px-3 pt-5 pb-2 text-slate-800 dark:text-white 
                   focus:ring-2 focus:ring-blue-400 outline-none transition"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <label
        className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 
                   transition-all peer-focus:text-blue-500"
      >
        {label}
      </label>
    </div>
  );
}
