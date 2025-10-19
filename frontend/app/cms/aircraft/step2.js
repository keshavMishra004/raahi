// "use client";
// import { motion } from "framer-motion";
// import { X, Wrench } from "lucide-react";
// import { useState } from "react";

// export default function Step2({ form, setForm, onBack, onSubmit }) {
//   const [error, setError] = useState("");

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9, y: 40 }}
//         animate={{ opacity: 1, scale: 1, y: 0 }}
//         transition={{ duration: 0.4, ease: "easeOut" }}
//         className="relative w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/20 
//                    bg-gradient-to-br from-indigo-50/90 via-white/90 to-blue-50/80 
//                    dark:from-slate-800/80 dark:to-slate-900/90 
//                    backdrop-blur-2xl"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-center p-6 border-b border-white/20">
//           <div className="flex items-center gap-3">
//             <Wrench className="text-blue-600 dark:text-blue-400" size={26} />
//             <div>
//               <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
//                 Step 2 — Performance, Specs & Amenities
//               </h2>
//               <p className="text-sm text-slate-500 dark:text-slate-300">
//                 Fill in the detailed specifications and onboard features.
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onBack}
//             className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
//           >
//             <X size={22} />
//           </button>
//         </div>

//         {/* Progress bar */}
//         <div className="w-full h-1 bg-slate-200 dark:bg-slate-700">
//           <motion.div
//             initial={{ width: "33%" }}
//             animate={{ width: "100%" }}
//             transition={{ duration: 0.8 }}
//             className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
//           ></motion.div>
//         </div>

//         <div className="p-6 space-y-8">
//           {error && (
//             <div className="bg-red-100 text-red-700 border border-red-300 p-2 rounded-md text-sm">
//               {error}
//             </div>
//           )}

//           {/* Performance & Technical Specs */}
//           <SectionTitle title="Performance & Technical Specs" />
//           <div className="grid grid-cols-2 gap-4">
//             <FloatingInput label="Range (NM/KM)" name="range" value={form.range} onChange={handleChange} />
//             <FloatingInput label="Cruise Speed (knots/kmph)" name="cruiseSpeed" value={form.cruiseSpeed} onChange={handleChange} />
//             <FloatingInput label="Service Ceiling (ft)" name="serviceCeiling" value={form.serviceCeiling} onChange={handleChange} />
//             <FloatingInput label="Takeoff Distance (m)" name="takeoffDistance" value={form.takeoffDistance} onChange={handleChange} />
//             <FloatingInput label="Landing Distance (m)" name="landingDistance" value={form.landingDistance} onChange={handleChange} />
//             <FloatingInput label="Rate of Climb (ft/min)" name="rateOfClimb" value={form.rateOfClimb} onChange={handleChange} />
//             <FloatingInput label="Max Takeoff Weight (Kg)" name="maxTakeoffWeight" value={form.maxTakeoffWeight} onChange={handleChange} />
//             <FloatingInput label="Fuel Capacity (Gallons/Kg)" name="fuelCapacity" value={form.fuelCapacity} onChange={handleChange} />
//           </div>

//           {/* Capacity & Layout */}
//           <SectionTitle title="Capacity & Layout" />
//           <div className="grid grid-cols-2 gap-4">
//             <FloatingInput label="Minimum Crew Required" name="minCrew" value={form.minCrew} onChange={handleChange} />
//             <FloatingSelect label="Pressurized Cabin" name="pressurized" value={form.pressurized} onChange={handleChange} options={["Yes", "No"]} />
//             <FloatingInput label="Cabin Height (ft/m)" name="cabinHeight" value={form.cabinHeight} onChange={handleChange} />
//             <FloatingInput label="Baggage Capacity (Kg)" name="baggageCapacity" value={form.baggageCapacity} onChange={handleChange} />
//           </div>

//           {/* Base & Availability */}
//           <SectionTitle title="Base & Availability" />
//           <div className="grid grid-cols-2 gap-4">
//             <FloatingInput label="Secondary Base(s)" name="secondaryBase" value={form.secondaryBase} onChange={handleChange} />
//             <FloatingSelect label="Availability Status" name="availability" value={form.availability} onChange={handleChange} options={["Active", "Under Maintenance", "Seasonal"]} />
//           </div>

//           {/* Cabin Amenities */}
//           <SectionTitle title="Cabin Amenities & Services" />
//           <div className="grid grid-cols-2 gap-4">
//             <FloatingSelect label="Wi-Fi" name="wifi" value={form.wifi} onChange={handleChange} options={["Yes", "No"]} />
//             <FloatingSelect label="In-flight Catering" name="catering" value={form.catering} onChange={handleChange} options={["Yes", "No"]} />
//             <FloatingSelect label="Medical Stretcher" name="medical" value={form.medical} onChange={handleChange} options={["Yes", "No"]} />
//             <FloatingSelect label="Food Service" name="foodService" value={form.foodService} onChange={handleChange} options={["Snacks", "Hot Meals", "None"]} />
//             <FloatingInput label="Flight Attendants (Number)" name="attendants" value={form.attendants} onChange={handleChange} />
//             <FloatingInput label="Lavatories (Number + Type)" name="lavatories" value={form.lavatories} onChange={handleChange} />
//           </div>

//           {/* Descriptions */}
//           <SectionTitle title="Description & Notes" />
//           <FloatingTextarea label="Short Description" name="shortDesc" value={form.shortDesc} onChange={handleChange} />
//           <FloatingTextarea label="Detailed Description" name="detailedDesc" value={form.detailedDesc} onChange={handleChange} />
//         </div>

//         {/* Footer */}
//         <div className="p-6 flex justify-between border-t border-white/20">
//           <button
//             onClick={onBack}
//             className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 
//                        hover:bg-slate-100 dark:text-slate-300 dark:border-slate-600 
//                        dark:hover:bg-slate-800 transition"
//           >
//             ← Back
//           </button>
//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.97 }}
//             onClick={onSubmit}
//             className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 
//                        text-white font-semibold shadow-md hover:shadow-lg transition"
//           >
//             Submit ✅
//           </motion.button>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// /* Floating Input */
// function FloatingInput({ label, ...props }) {
//   return (
//     <div className="relative">
//       <input
//         {...props}
//         className="peer w-full border border-slate-300 dark:border-slate-600 bg-transparent 
//         rounded-lg px-3 pt-5 pb-2 text-slate-800 dark:text-white 
//         focus:ring-2 focus:ring-blue-400 outline-none transition"
//       />
//       <label
//         className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 
//                    transition-all peer-focus:text-blue-500"
//       >
//         {label}
//       </label>
//     </div>
//   );
// }

// /* Floating Select */
// function FloatingSelect({ label, options = [], ...props }) {
//   return (
//     <div className="relative">
//       <select
//         {...props}
//         className="peer w-full border border-slate-300 dark:border-slate-600 bg-transparent 
//                    rounded-lg px-3 pt-5 pb-2 text-slate-800 dark:text-white 
//                    focus:ring-2 focus:ring-blue-400 outline-none transition"
//       >
//         <option value="">Select {label}</option>
//         {options.map((opt) => (
//           <option key={opt}>{opt}</option>
//         ))}
//       </select>
//       <label
//         className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 
//                    transition-all peer-focus:text-blue-500"
//       >
//         {label}
//       </label>
//     </div>
//   );
// }

// /* Floating Textarea */
// function FloatingTextarea({ label, ...props }) {
//   return (
//     <div className="relative">
//       <textarea
//         {...props}
//         rows="4"
//         className="peer w-full border border-slate-300 dark:border-slate-600 bg-transparent 
//                    rounded-lg px-3 pt-5 pb-2 text-slate-800 dark:text-white 
//                    focus:ring-2 focus:ring-blue-400 outline-none transition resize-none"
//       />
//       <label
//         className="absolute left-3 top-2 text-sm text-slate-500 dark:text-slate-400 
//                    transition-all peer-focus:text-blue-500"
//       >
//         {label}
//       </label>
//     </div>
//   );
// }

// /* Section Title */
// function SectionTitle({ title }) {
//   return (
//     <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 border-l-4 border-blue-500 pl-3">
//       {title}
//     </h3>
//   );
// }
