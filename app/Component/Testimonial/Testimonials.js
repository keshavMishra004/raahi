"use client";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  { name: "Shivam Mishra", text: "Lorem ipsum dolor sit amet...", rating: 4.8 },
  { name: "Gyanvi Mehta", text: "This service was excellent, satisfied!", rating: 4.4 },
  { name: "Priya Sharma", text: "Booking was super easy.", rating: 2.5 },
  { name: "Rahul Verma", text: "Affordable and convenient.jfjnferjkrj vrjev reknvjg vvtkjrg ktrbv   v jekvejr", rating: 5 },
  { name: "Veronica Kumari", text: "They are very supportive and thier staff is supportive too.", rating: 5 },
];

// Star Rating Component (Full + Half + Empty)
function StarRating({ rating }) {
  const fullStars = Math.floor(rating);      // full stars
  const hasHalfStar = rating % 1 >= 0.5;     // half star if >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex text-orange-500">
      {/* Full Stars */}
      {Array(fullStars).fill(0).map((_, i) => (
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 
            1.402 8.171L12 18.896l-7.336 3.857 
            1.402-8.171L.132 9.21l8.2-1.192z" />
        </svg>
      ))}

      {/* Half Star */}
      {hasHalfStar && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="w-5 h-5"
        >
          <defs>
            <linearGradient id="half-grad">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <path
            d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 
              1.402 8.171L12 18.896l-7.336 3.857 
              1.402-8.171L.132 9.21l8.2-1.192z"
            fill="url(#half-grad)"
            stroke="currentColor"
          />
        </svg>
      )}

      {/* Empty Stars */}
      {Array(emptyStars).fill(0).map((_, i) => (
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.782 
            1.402 8.171L12 18.896l-7.336 3.857 
            1.402-8.171L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const baseX = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const [loopWidth, setLoopWidth] = useState(0);

  const speed = 80; // px per second

  // Measure width of half track (since we duplicate for loop)
  useEffect(() => {
    if (trackRef.current) {
      const total = trackRef.current.scrollWidth / 2;
      setLoopWidth(total);
    }
  }, []);

  // Auto scroll loop
  useAnimationFrame((t, delta) => {
    if (!isPaused && loopWidth > 0) {
      let move = baseX.get() - (speed * delta) / 1000;
      if (move <= -loopWidth) {
        move = 0;
      }
      baseX.set(move);
    }
  });

  return (
    <section className="bg-[#fdeee5] py-16">
      <div className="text-left ml-20 mb-10">
        <h2 className="text-3xl font-bold">Customer Stories</h2>
        <p className="text-gray-600">Feedback from our customers.</p>
      </div>

      <div
        className="relative overflow-hidden bg-teal-500 py-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          ref={trackRef}
          className="flex gap-6 px-6 cursor-grab active:cursor-grabbing"
          style={{ x: baseX }}
          drag="x"
          dragConstraints={{ left: -loopWidth, right: 0 }}
          onDragStart={() => setIsPaused(true)}
          onDragEnd={() => setIsPaused(false)}
        >
          {[...testimonials, ...testimonials].map((t, i) => (
            <div
              key={i}
              className="bg-[#fdeee5] p-6 rounded-lg shadow-lg min-w-[300px] max-w-[300px]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-300 font-bold">
                  {t.name.charAt(0)}
                </div>
                <h3 className="font-semibold">{t.name}</h3>
              </div>

              {/*  Stars */}
              <div className="mb-3">
                <StarRating rating={t.rating} />
              </div>

              <p className="text-gray-600 text-sm italic">“{t.text}”</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

