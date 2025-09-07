
"use client";
import { useEffect, useState, useRef } from "react";
import { Plane } from "lucide-react";

const sections = ["hero", "charters", "aerial", "pilgrimage"];

export default function ScrollSpyNav() {
  const [scrollRatio, setScrollRatio] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);

  // Sync plane with scroll
  useEffect(() => {
    const handleScroll = () => {
      if (dragging) return;
      const ratio =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      setScrollRatio(ratio);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dragging]);

  // --- Dragging logic ---
  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", onDrag);
    document.addEventListener("touchend", stopDrag);
  };

  const onDrag = (e) => {
    if (!trackRef.current) return;

    const trackRect = trackRef.current.getBoundingClientRect();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    let pos = (clientY - trackRect.top) / trackRect.height;
    pos = Math.max(0, Math.min(1, pos));

    setScrollRatio(pos);

    window.scrollTo({
      top:
        pos * 
        (document.documentElement.scrollHeight - window.innerHeight),
      behavior: "auto",
    });
  };

  const stopDrag = () => {
    setDragging(false);
    document.removeEventListener("mousemove", onDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onDrag);
    document.removeEventListener("touchend", stopDrag);
  };

  // --- Dot click scroll ---
  const handleDotClick = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
      <div
        ref={trackRef}
        className="relative flex flex-col items-center justify-between bg-teal-900 rounded-full py-6 h-[300px] w-10"
      >
        {/* Dots */}
        <div className="absolute inset-0 flex flex-col justify-between items-center py-6">
          {sections.map((id) => (
            <span
              key={id}
              onClick={() => handleDotClick(id)}
              className="w-3 h-3 rounded-full bg-teal-400 opacity-70 cursor-pointer hover:scale-125 transition"
            ></span>
          ))}
        </div>

        {/* Plane */}
        <div
          className="absolute left-8  -translate-x-1/2 cursor-grab active:cursor-grabbing text-orange-500"
          style={{
            top: `${scrollRatio * 90}%`,
            transform: "translate(-50%, -50%) rotate(135deg)",
          }}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
        >
          <Plane size={25} fill="currentColor" />
        </div>
      </div>
    </div>
  );
}




