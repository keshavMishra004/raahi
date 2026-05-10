"use client";
const LOCATIONS = [
  { name: "Goa", coords: [15.2993, 74.124], id: 1 },
  { name: "Leh", coords: [34.1526, 77.5771], id: 2 },
  { name: "Jaipur", coords: [26.9124, 75.7873], id: 3 },
  { name: "Rann of Kutch", coords: [23.7337, 69.8597], id: 4 },
  { name: "Varanasi", coords: [25.3176, 82.9739], id: 5 },
  { name: "Andaman", coords: [11.7401, 92.6586], id: 6 },
];
import { useState } from "react";

export default function MapSection() {
  const [selected, setSelected] = useState(LOCATIONS[0]);
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden">
          <div className="md:w-1/3 p-8 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-100">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Discover Your Destination</h2>
            <ul className="flex flex-col gap-2">
              {LOCATIONS.map((loc) => (
                <li
                  key={loc.id}
                  className={`px-4 py-2 rounded-lg cursor-pointer font-medium transition-all duration-150 ${selected.id===loc.id?"bg-blue-700 text-white":"hover:bg-blue-100 text-gray-800"}`}
                  onClick={()=>setSelected(loc)}
                >
                  {loc.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
            <div className="w-full h-72 md:h-96 flex items-center justify-center">
              <img
                src="/img/india-map.png"
                alt="India Map"
                className="w-full h-full object-contain"
              />
              <div className="absolute">
                {/* Map markers can be added here for interactivity */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
