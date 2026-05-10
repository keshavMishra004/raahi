"use client";
const TESTIMONIALS = [
  { name: "Amit S.", img: "/img/user1.jpg", rating: 5, text: "The booking process was seamless and the flight experience was top-notch! Highly recommended." },
  { name: "Priya K.", img: "/img/user2.jpg", rating: 4, text: "Loved the personalized service and quick support. Will book again!" },
  { name: "Rahul M.", img: "/img/user3.jpg", rating: 5, text: "Best charter experience in India. The team was very professional." },
  { name: "Sneha R.", img: "/img/user4.jpg", rating: 5, text: "The pilgrimage flight was comfortable and well-organized. Thank you!" },
];
import { useState } from "react";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Stories</h2>
        <div className="flex items-center gap-8">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition"
            onClick={() => setIdx((i) => (i === 0 ? TESTIMONIALS.length - 1 : i - 1))}
            aria-label="Previous"
          >
            <span className="text-2xl">&#8592;</span>
          </button>
          <div className="flex-1 flex justify-center">
            <div className="relative w-[340px] bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
              <div className="flex -space-x-4 mb-4">
                {TESTIMONIALS.map((t, i) => (
                  <img
                    key={t.name}
                    src={t.img}
                    alt={t.name}
                    className={`w-16 h-16 rounded-full border-4 border-white object-cover shadow-lg ${i === idx ? "z-10 scale-110" : "z-0 opacity-60"} transition-all duration-300`}
                    style={{ left: `${i * 24}px` }}
                  />
                ))}
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < TESTIMONIALS[idx].rating ? "text-yellow-400" : "text-gray-300"}`}>&#9733;</span>
                ))}
              </div>
              <div className="text-gray-800 text-center mb-2">"{TESTIMONIALS[idx].text}"</div>
              <div className="font-semibold text-blue-700">{TESTIMONIALS[idx].name}</div>
            </div>
          </div>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition"
            onClick={() => setIdx((i) => (i === TESTIMONIALS.length - 1 ? 0 : i + 1))}
            aria-label="Next"
          >
            <span className="text-2xl">&#8594;</span>
          </button>
        </div>
      </div>
    </section>
  );
}
