"use client";
import React, { useEffect, useRef } from "react";
import "../css/featuredServices.css";

const services = [
  { name: "Private Charter", imageUrl: '/img/privateCharter.jpg' },
  { name: "Air Ambulance", imageUrl: "/img/air.jpg" },
  { name: "Aero Sports", imageUrl: "/img/aeroSports.jpg" },
  { name: "Empty Leg", imageUrl: "/img/empty.jpg" },
  { name: "Pilgrimage Flights", imageUrl: "/img/pilgrimage.jpg" },
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
