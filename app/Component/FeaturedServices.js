import React from "react";
import FeaturedServicesClient from "./FeaturedServicesClient";
import "../css/featuredServices.css";

const services = [
  { name: "Private Charter", imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80" },
  { name: "Air Ambulance", imageUrl: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80" },
  { name: "Aero Sports", imageUrl: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80" },
  { name: "Empty Leg", imageUrl: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=800&q=80" },
  { name: "Pilgrimage Flights", imageUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80" },
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
