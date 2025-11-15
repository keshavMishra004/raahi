"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { X, Plane } from "lucide-react";
import api from "@/utils/axios";

export default function AddAircraftForm({ onClose }) {
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Optional: prevent background scroll while modal open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev || "auto";
    };
  }, []);

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
    // Step 4 fields
    seatConfig: {
      totalRows: 0,
      seatPattern: "",
      seats: [],
    },
    // Step 5 fields
    serviceConfigurations: {
      airAmbulance: {},
      privateCharter: {},
      pilgrimage: {},
      udaanFlight: {},
      aerialService: {},
    },
  });

  const [seatRows, setSeatRows] = useState("");
  const [seatPattern, setSeatPattern] = useState("");
  const [seatLayout, setSeatLayout] = useState([]);
  const [selectedSeatTool, setSelectedSeatTool] = useState("standard");

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
    Helicopters: [
      "Light Helicopter",
      "Twin Engine Helicopter",
      "Heavy Helicopter",
    ],
    "Lighter-Than-Air": ["Hot Air Balloon", "Airship / Blimp"],
    "Gliders & Non-Powered": ["Glider", "Paraglider"],
    Other: [],
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 45 }, (_, i) => `${currentYear - i}`);

  // universal change handlers
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMultiSelect = (name, value) => {
    setForm((prev) => {
      const arr = prev[name] || [];
      return {
        ...prev,
        [name]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const handlePhotoUpload = (e) => {
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...Array.from(e.target.files)],
    }));
  };

  // step navigation
  const handleStep1Next = () => setStep(2);
  const handleStep2Next = () => setStep(3);
  const handleStep3Next = () => setStep(4);
  const handleStep4Next = () => setStep(5);
  const handleStepBack = () => setStep((s) => s - 1);

  // seat config logic
  const seatTools = [
    { key: "standard", label: "Standard", color: "bg-blue-100" },
    { key: "extra", label: "Extra Legroom", color: "bg-yellow-100" },
    { key: "business", label: "Business", color: "bg-purple-100" },
    { key: "unavailable", label: "Unavailable", color: "bg-red-200" },
    { key: "none", label: "No Such Seat", color: "bg-gray-200" },
    { key: "window", label: "Window", color: "bg-cyan-100" },
  ];

  const handleGenerateLayout = () => {
    const rows = parseInt(seatRows);
    if (!rows || !seatPattern.match(/^\d+(-\d+)*$/)) return;
    const pattern = seatPattern.split("-").map(Number);
    let seatLetters = [];
    let charCode = 65;
    pattern.forEach((n) => {
      for (let i = 0; i < n; i++) seatLetters.push(String.fromCharCode(charCode++));
    });
    const layout = [];
    for (let r = 1; r <= rows; r++) {
      layout.push(seatLetters.map((col) => ({ row: r, col, type: "standard" })));
    }
    setSeatLayout(layout);
    setForm((prev) => ({
      ...prev,
      seatConfig: { totalRows: rows, seatPattern, seats: layout.flat() },
    }));
  };

  const handleSeatClick = (rowIdx, colIdx) => {
    setSeatLayout((prev) => {
      const newLayout = prev.map((row, r) =>
        row.map((seat, c) => (r === rowIdx && c === colIdx ? { ...seat, type: selectedSeatTool } : seat))
      );
      setForm((prevForm) => ({
        ...prevForm,
        seatConfig: { ...prevForm.seatConfig, seats: newLayout.flat() },
      }));
      return newLayout;
    });
  };

  // STEP 5 - change service configuration fields (robust)
  // Accepts either an event or a raw value/boolean
  const handleChangeServiceConfig = (service, field, maybeEventOrValue) => {
    let newValue;
    // if it's an event
    if (maybeEventOrValue && maybeEventOrValue.target !== undefined) {
      const ev = maybeEventOrValue;
      if (ev.target.type === "checkbox") newValue = ev.target.checked;
      else newValue = ev.target.value;
    } else {
      // plain value passed (boolean / string)
      newValue = maybeEventOrValue;
    }

    setForm((prev) => ({
      ...prev,
      serviceConfigurations: {
        ...prev.serviceConfigurations,
        [service]: {
          ...prev.serviceConfigurations[service],
          [field]: newValue,
        },
      },
    }));
  };

  // submit
  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        // If it's a File or array of Files (photos), append appropriately
        if (key === "photos" && Array.isArray(value)) {
          value.forEach((f, idx) => {
            if (f instanceof File) fd.append("photos", f);
            else fd.append(`photos[${idx}]`, JSON.stringify(f));
          });
        } else if (value instanceof File) {
          fd.append(key, value);
        } else if (typeof value === "object") {
          fd.append(key, JSON.stringify(value));
        } else {
          fd.append(key, value ?? "");
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

  // --- reusable card wrapper ---
  const ServiceCard = ({ title, color, children }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className={`${color} bg-white/90 dark:bg-slate-800/90 border rounded-xl shadow-sm p-5`}>
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-[850px] max-h-[90vh] rounded-2xl shadow-2xl border border-white/20 
                   bg-gradient-to-br from-indigo-50/90 via-white/90 to-blue-50/80 
                   dark:from-slate-800/80 dark:to-slate-900/90 
                   backdrop-blur-2xl flex flex-col"
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
                  : step === 3
                  ? "Assign Services"
                  : step === 4
                  ? "Seat Configuration & Layout"
                  : "Service-Specific Configuration"}
              </h2>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
            <X size={22} />
          </button>
        </div>

        {/* Body - use a real form and block submit to avoid accidental page refresh */}
        <form onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Error message */}
          {error && (
            <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded-md text-sm sticky top-0">
              {error}
            </div>
          )}

          {/* Steps content */}
          {step === 1 && (
            <div>
              <FloatingInput label="Registration No." name="registration" value={form.registration} onChange={handleChange} />
              <FloatingInput label="Model" name="model" value={form.model} onChange={handleChange} />

              <FloatingSelect
                label="Category"
                name="category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value, type: "", customType: "" })}
                options={Object.keys(categories)}
              />

              {form.category && form.category !== "Other" ? (
                <FloatingSelect label="Type" name="type" value={form.type} onChange={handleChange} options={categories[form.category]} />
              ) : form.category === "Other" ? (
                <FloatingInput label="Custom Type" name="customType" value={form.customType} onChange={handleChange} />
              ) : (
                <FloatingInput label="Select category first" disabled />
              )}

              <FloatingInput label="Crew Capacity" name="crewCapacity" type="number" value={form.crewCapacity} onChange={handleChange} />
              <FloatingInput label="Passenger Capacity" name="passengerCapacity" type="number" value={form.passengerCapacity} onChange={handleChange} />
              <FloatingInput label="Base Airport (ICAO)" name="base" value={form.base} onChange={handleChange} />

              <FloatingSelect label="Status" name="status" value={form.status} onChange={handleChange} options={["In Service", "Under Maintenance", "Retired"]} />
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingSelect label="Make Year" name="makeYear" value={form.makeYear} onChange={handleChange} options={years} />
                  <FloatingSelect label="Year of Registration" name="registrationYear" value={form.registrationYear} onChange={handleChange} options={years} />
                </div>

                <div className="col-span-2 mt-4">
                  <label className="block text-sm text-slate-600 mb-1">DGCA Certificate of Airworthiness</label>
                  <label className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                    <span className="text-blue-700 font-medium">{form.dgcaCertificate?.name || "Choose File"}</span>
                    <input type="file" name="dgcaCertificate" onChange={handleChange} className="hidden" />
                  </label>
                  {form.dgcaCertificate && <span className="text-xs text-slate-500 ml-2">Selected: {form.dgcaCertificate.name}</span>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Performance & Technical Specs</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput label="Range (NM/KM)" name="range" value={form.range} onChange={handleChange} />
                  <FloatingInput label="Cruise Speed (knots/kmph)" name="cruiseSpeed" value={form.cruiseSpeed} onChange={handleChange} />
                  <FloatingInput label="Service Ceiling (ft)" name="serviceCeiling" value={form.serviceCeiling} onChange={handleChange} />
                  <FloatingInput label="Takeoff Distance (m)" name="takeoffDistance" value={form.takeoffDistance} onChange={handleChange} />
                  <FloatingInput label="Landing Distance (m)" name="landingDistance" value={form.landingDistance} onChange={handleChange} />
                  <FloatingInput label="Rate of Climb (ft/min)" name="rateOfClimb" value={form.rateOfClimb} onChange={handleChange} />
                  <FloatingInput label="Max Takeoff Weight (Kg)" name="maxTakeoffWeight" value={form.maxTakeoffWeight} onChange={handleChange} />
                  <FloatingInput label="Fuel Capacity (Gallons/Kg)" name="fuelCapacity" value={form.fuelCapacity} onChange={handleChange} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Capacity & Layout</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput label="Minimum Crew Required" name="minCrew" type="number" value={form.minCrew} onChange={handleChange} />
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="pressurizedCabin" checked={form.pressurizedCabin} onChange={handleChange} id="pressurizedCabin" />
                    <label htmlFor="pressurizedCabin" className="text-sm text-slate-600">Pressurized Cabin</label>
                  </div>
                  <FloatingInput label="Cabin Height (ft/m)" name="cabinHeight" value={form.cabinHeight} onChange={handleChange} />
                  <FloatingInput label="Baggage Capacity (Kg)" name="baggageCapacity" value={form.baggageCapacity} onChange={handleChange} />
                  <FloatingInput label="Baggage Dimensions" name="baggageDimensions" value={form.baggageDimensions} onChange={handleChange} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Base & Availability</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput label="Secondary Base(s)" name="secondaryBases" value={form.secondaryBases} onChange={handleChange} />
                  <FloatingSelect label="Availability Status" name="availabilityStatus" value={form.availabilityStatus} onChange={handleChange} options={["Active", "Under Maintenance", "Seasonal"]} />
                </div>
              </div>

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

              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Description & Notes</h3>
                <div className="grid grid-cols-2 gap-4">
                  <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Short Description" className="border rounded px-3 py-2 w-full" />
                  <textarea name="detailedDescription" value={form.detailedDescription} onChange={handleChange} placeholder="Detailed Description" className="border rounded px-3 py-2 w-full" />
                  <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} placeholder="Additional Notes (Private)" className="border rounded px-3 py-2 w-full col-span-2" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["Air Ambulance", "Private Charter", "Pilgrimage", "Udaan Flight", "Aerial Service"].map((service) => (
                <label
                  key={service}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    form.services.includes(service) ? "bg-blue-50 border-blue-300 text-blue-800" : "border-gray-200 text-gray-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-0"
                    checked={form.services.includes(service)}
                    onChange={() =>
                      setForm((prev) => ({
                        ...prev,
                        services: prev.services.includes(service) ? prev.services.filter((s) => s !== service) : [...prev.services, service],
                      }))
                    }
                  />
                  <span className="text-base font-medium">{service}</span>
                </label>
              ))}
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div>
              <div className="mb-4 flex gap-6 items-end">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Rows</label>
                  <input type="number" min={1} className="border rounded px-3 py-2 w-24" value={seatRows} onChange={(e) => setSeatRows(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seat Configuration</label>
                  <input type="text" placeholder="e.g. 2-3-2" className="border rounded px-3 py-2 w-32" value={seatPattern} onChange={(e) => setSeatPattern(e.target.value)} />
                </div>
                <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold ml-2" onClick={handleGenerateLayout}>
                  Generate Layout
                </button>
              </div>

              <div className="mb-4 flex gap-3 flex-wrap">
                {seatTools.map((tool) => (
                  <button key={tool.key} type="button" className={`flex items-center gap-2 px-3 py-1 rounded border ${tool.color} ${selectedSeatTool === tool.key ? "ring-2 ring-blue-500" : ""}`} onClick={() => setSelectedSeatTool(tool.key)}>
                    {tool.label}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto">
                {seatLayout.length > 0 && (
                  <table className="mx-auto border-separate border-spacing-2">
                    <tbody>
                      {seatLayout.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          <td className="pr-2 font-semibold text-slate-500">{rowIdx + 1}</td>
                          {row.map((seat, colIdx) => (
                            <td key={colIdx}>
                              <button
                                type="button"
                                className={`w-9 h-9 rounded border text-xs font-bold ${
                                  seat.type === "standard"
                                    ? "bg-blue-100 border-blue-300 text-blue-700"
                                    : seat.type === "extra"
                                    ? "bg-yellow-100 border-yellow-400 text-yellow-800"
                                    : seat.type === "business"
                                    ? "bg-purple-100 border-purple-400 text-purple-800"
                                    : seat.type === "unavailable"
                                    ? "bg-red-200 border-red-400 text-red-700"
                                    : seat.type === "none"
                                    ? "bg-gray-200 border-gray-400 text-gray-500"
                                    : seat.type === "window"
                                    ? "bg-cyan-100 border-cyan-400 text-cyan-800"
                                    : "bg-white border-gray-300"
                                }`}
                                onClick={() => handleSeatClick(rowIdx, colIdx)}
                                title={seat.type.charAt(0).toUpperCase() + seat.type.slice(1)}
                              >
                                {seat.col}
                              </button>
                            </td>
                          ))}
                          <td className="pl-2 font-semibold text-slate-500">{rowIdx + 1}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td></td>
                        {seatLayout[0]?.map((seat, idx) => (
                          <td key={idx} className="text-xs text-slate-400">{seat.col}</td>
                        ))}
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* STEP 5 */}
          {step === 5 && (
            <div className="grid grid-cols-1 gap-6 pb-4">
              {form.services.includes("Air Ambulance") && (
                <ServiceCard title="Air Ambulance Configuration" color="border-red-400">
                  <div className="grid grid-cols-2 gap-4">
                    <FloatingInput
                      label="Stretcher Capacity"
                      name="airAmbulance_stretcherCapacity"
                      value={form.serviceConfigurations.airAmbulance?.stretcherCapacity || ""}
                      onChange={(e) => handleChangeServiceConfig("airAmbulance", "stretcherCapacity", e)}
                    />
                    <FloatingSelect
                      label="Medevac Certified?"
                      name="airAmbulance_medevacCertified"
                      options={["Yes", "No"]}
                      value={form.serviceConfigurations.airAmbulance?.medevacCertified || ""}
                      onChange={(e) => handleChangeServiceConfig("airAmbulance", "medevacCertified", e)}
                    />
                    <div className="col-span-2 grid grid-cols-3 gap-4">
                      {["Ventilator", "ECG Machine", "Incubator"].map((item) => (
                        <label key={item} className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={form.serviceConfigurations.airAmbulance?.[item.toLowerCase().replace(/ /g, "")] || false}
                            onChange={(e) => handleChangeServiceConfig("airAmbulance", item.toLowerCase().replace(/ /g, ""), e)}
                            className="rounded border-gray-300"
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                </ServiceCard>
              )}

              {form.services.includes("Private Charter") && (
                <ServiceCard title="Private Charter Configuration" color="border-blue-400">
                  <FloatingInput
                    label="Max Range (NM)"
                    name="privateCharter_maxRange"
                    value={form.serviceConfigurations.privateCharter?.maxRange || ""}
                    onChange={(e) => handleChangeServiceConfig("privateCharter", "maxRange", e)}
                  />
                  <FloatingInput
                    label="Cruising Speed (Kts)"
                    name="privateCharter_cruiseSpeed"
                    value={form.serviceConfigurations.privateCharter?.cruiseSpeed || ""}
                    onChange={(e) => handleChangeServiceConfig("privateCharter", "cruiseSpeed", e)}
                  />
                  <div className="col-span-2">
                    {["In-flight Wi-Fi", "Lavatory", "Galley"].map((label) => (
                      <label key={label} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.serviceConfigurations.privateCharter?.[label.toLowerCase().replace(/ /g, "")] || false}
                          onChange={(e) => handleChangeServiceConfig("privateCharter", label.toLowerCase().replace(/ /g, ""), e)}
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </ServiceCard>
              )}

              {form.services.includes("Pilgrimage") && (
                <ServiceCard title="Pilgrimage Configuration" color="border-yellow-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.serviceConfigurations.pilgrimage?.highAltitudeKit || false}
                      onChange={(e) => handleChangeServiceConfig("pilgrimage", "highAltitudeKit", e)}
                    />
                    High-Altitude Kit Installed?
                  </label>
                  <FloatingSelect
                    label="DGCA Approval for Kedarnath?"
                    name="pilgrimage_dgcaApproval"
                    options={["Yes", "No"]}
                    value={form.serviceConfigurations.pilgrimage?.dgcaApproval || ""}
                    onChange={(e) => handleChangeServiceConfig("pilgrimage", "dgcaApproval", e)}
                  />
                </ServiceCard>
              )}

              {form.services.includes("Udaan Flight") && (
                <ServiceCard title="Udaan Flight Configuration" color="border-green-400">
                  <FloatingInput
                    label="RCS Route Approval #"
                    name="udaanFlight_rcsRouteApproval"
                    value={form.serviceConfigurations.udaanFlight?.rcsRouteApproval || ""}
                    onChange={(e) => handleChangeServiceConfig("udaanFlight", "rcsRouteApproval", e)}
                  />
                  <FloatingSelect
                    label="Subsidy Category"
                    name="udaanFlight_subsidyCategory"
                    options={["Category I", "Category II", "Category III"]}
                    value={form.serviceConfigurations.udaanFlight?.subsidyCategory || ""}
                    onChange={(e) => handleChangeServiceConfig("udaanFlight", "subsidyCategory", e)}
                  />
                </ServiceCard>
              )}

              {form.services.includes("Aerial Service") && (
                <ServiceCard title="Aerial Service Configuration" color="border-purple-400">
                  <FloatingInput
                    label="Capacity (Solo / Tandem / Group)"
                    name="aerialService_capacity"
                    value={form.serviceConfigurations.aerialService?.capacity || ""}
                    onChange={(e) => handleChangeServiceConfig("aerialService", "capacity", e)}
                  />
                  <FloatingInput
                    label="Equipment Standards"
                    name="aerialService_equipmentStandards"
                    value={form.serviceConfigurations.aerialService?.equipmentStandards || ""}
                    onChange={(e) => handleChangeServiceConfig("aerialService", "equipmentStandards", e)}
                  />
                </ServiceCard>
              )}
            </div>
          )}
        </form>

        {/* FOOTER */}
        <div className="p-6 flex justify-end gap-3 border-t border-white/20">
          {step > 1 && (
            <button type="button" onClick={handleStepBack} className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition">
              ← Back
            </button>
          )}

          {step < 5 && (
            <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={() => setStep(step + 1)} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition">
              Next →
            </motion.button>
          )}

          {step === 5 && (
            <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} onClick={handleSubmit} className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg transition">
              Save Aircraft
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* Floating Inputs */
function FloatingInput({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        className="peer w-full border border-slate-300 dark:border-slate-600 bg-transparent
          rounded-lg px-3 pt-5 pb-2 text-slate-800 dark:text-white
          focus:ring-2 focus:ring-blue-400 outline-none transition"
      />
      <label className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 transition-all peer-focus:text-blue-500">
        {label}
      </label>
    </div>
  );
}

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
      <label className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 transition-all peer-focus:text-blue-500">
        {label}
      </label>
    </div>
  );
}
