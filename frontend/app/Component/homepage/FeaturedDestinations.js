"use client";
const DESTINATIONS = [
  { img: "/img/dest1.jpg", title: "Goa" },
  { img: "/img/dest2.jpg", title: "Leh" },
  { img: "/img/dest3.jpg", title: "Jaipur" },
  { img: "/img/dest4.jpg", title: "Rann of Kutch" },
  { img: "/img/dest5.jpg", title: "Varanasi" },
  { img: "/img/dest6.jpg", title: "Andaman" },
];
const CATEGORIES = [
  "Trending Destinations",
  "Events Across India",
  "Seasonal Picks",
];
import { useState } from "react";

export default function FeaturedDestinations() {
  const [cat, setCat] = useState(0);
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Experiences</h2>
          <div className="flex gap-2">
            {CATEGORIES.map((c, i) => (
              <button
                key={c}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-150 ${cat===i?"bg-blue-700 text-white":"bg-gray-100 text-gray-700 hover:bg-blue-100"}`}
                onClick={()=>setCat(i)}
              >{c}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {DESTINATIONS.map((d) => (
            <div key={d.title} className="min-w-[220px] h-64 rounded-2xl overflow-hidden shadow-lg relative group cursor-pointer">
              <img src={d.img} alt={d.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white text-lg font-semibold drop-shadow-lg">{d.title}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
