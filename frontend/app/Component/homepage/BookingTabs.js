"use client";
const TABS = [
  { key: "fly", label: "Fly Smarter", bg: "/img/hero-fly.jpg" },
  { key: "sports", label: "Aerial Sports & Activities", bg: "/img/hero-sports.jpg" },
  { key: "pilgrimage", label: "Pilgrimage Flights", bg: "/img/hero-pilgrimage.jpg" },
  { key: "charter", label: "Private Charter", bg: "/img/hero-charter.jpg" },
  { key: "ambulance", label: "Air Ambulance", bg: "/img/hero-ambulance.jpg" },
  { key: "empty", label: "Empty Leg", bg: "/img/hero-empty.jpg" },
];
import { useState } from "react";

export default function BookingTabs() {
  const [active, setActive] = useState(TABS[0]);
  const [tripType, setTripType] = useState("oneway");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-6 justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              active.key === tab.key
                ? "bg-blue-700 text-white shadow-lg"
                : "bg-white/30 text-white/80 hover:bg-white/50"
            }`}
            onClick={() => setActive(tab)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className="relative rounded-2xl shadow-xl bg-white/60 backdrop-blur-lg p-8 flex flex-col gap-6"
        style={{
          backgroundImage: `url(${active.bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70 backdrop-blur-xl rounded-2xl z-0" />
        <form className="relative z-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                tripType === "oneway"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white/80 text-blue-700 border-blue-400"
              }`}
              onClick={() => setTripType("oneway")}
            >
              One Way
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150 ${
                tripType === "round"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white/80 text-blue-700 border-blue-400"
              }`}
              onClick={() => setTripType("round")}
            >
              Round Trip
            </button>
          </div>
          <input
            type="text"
            placeholder="From"
            className="form-input w-28 md:w-32 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
          <input
            type="text"
            placeholder="To"
            className="form-input w-28 md:w-32 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <input
            type="date"
            className="form-input w-32 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="number"
            min={1}
            max={12}
            className="form-input w-20 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={passengers}
            onChange={(e) => setPassengers(Number(e.target.value))}
          />
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-xl shadow transition-all duration-200"
          >
            {active.key === "fly" ? "Search" : "Explore"}
          </button>
        </form>
      </div>
    </div>
  );
}
