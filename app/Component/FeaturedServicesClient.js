"use client";
import React, { useEffect, useRef } from "react";
import "../css/featuredServices.css";

const services = [
  { name: "Private Charter", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" },
  { name: "Air Ambulance", imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" },
  { name: "Aero Sports", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80" },
  { name: "Empty Leg", imageUrl: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80" },
  { name: "Pilgrimage Flights", imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80" },
];

function FeaturedServicesClient() {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    function nextService() {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }
    intervalRef.current = setInterval(nextService, 1500);
    return () => clearInterval(intervalRef.current);
  }, []);

  function handleOptionClick(idx) {
    setActiveIndex(idx);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % services.length);
    }, 1500);
  }

  return (
    <div className="featured-container">
      <div className="featured-options">
        {services.map((service, idx) => (
          <button
            key={service.name}
            type="button"
            className={`featured-option${idx === activeIndex ? " active" : ""}`}
            tabIndex={-1}
            aria-disabled={idx !== activeIndex}
            onClick={() => handleOptionClick(idx)}
          >
            {service.name}
          </button>
        ))}
      </div>
      <div className="featured-frame">
        <img
          src={services[activeIndex].imageUrl}
          alt={services[activeIndex].name}
          className="featured-image"
        />
      </div>
    </div>
  );
}

export default FeaturedServicesClient;
