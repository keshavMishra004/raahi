import React from "react";
import FeaturedServicesClient from "./FeaturedServicesClient";
import "../css/featuredServices.css";

const services = [
  { name: "Private Charter", imageUrl: '/img/privateCharter.jpg' },
  { name: "Air Ambulance", imageUrl: "/img/air.jpg" },
  { name: "Aero Sports", imageUrl: "/img/aeroSports.jpg" },
  { name: "Empty Leg", imageUrl: "/img/empty.jpg" },
  { name: "Pilgrimage Flights", imageUrl: "/img/pilgrimage.jpg" },
];

function FeaturedServices() {
  // Only render the static section for SEO/JS-disabled users
  return (
    <section className="featured-services">
        <h2>FEATURED SERVICES</h2>
      <noscript>
        <div className="featured-container">
          <div className="featured-options">
            {services.map((service, idx) => (
              <button
                key={service.name}
                type="button"
                className={`featured-option${idx === 0 ? " active" : ""}`}
                tabIndex={-1}
                aria-disabled={idx !== 0}
              >
                {service.name}
              </button>
            ))}
          </div>
          <div className="featured-frame">
            <img
              src={services[0].imageUrl}
              alt={services[0].name}
              className="featured-image"
            />
          </div>
        </div>
      </noscript>
      <FeaturedServicesClient />
    </section>
  );
}

export default FeaturedServices;
