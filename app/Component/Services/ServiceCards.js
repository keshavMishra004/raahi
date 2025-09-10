"use client"
import { useState } from "react";
import Image from "next/image";

const servicesData = [
  { id: "fly-bharat", title: "Fly Bharat (UDAN)", description: "Affordable regional flights.", image: "/fly-bharat.jpg" },
  { id: "charters", title: "Charters", description: "Private, Air Ambulance, Empty Leg.", image: "/charters.jpeg" },
  { id: "aerial", title: "Aerial Services", description: "Aero sports & tourism.", image: "/sky-diving.png" },
  { id: "pilgrimage", title: "Pilgrimage Flights", description: "Spiritual journeys made easy.", image: "/pilgm.png" },
];

export default function ServiceCards() {
  const [active, setActive] = useState("fly-bharat");

  return (
    <div className="flex bg-white/10 rounded-2xl overflow-hidden">
      {servicesData.map((service) => (
        <div
          key={service.id}
          className={`transition-all duration-500 cursor-pointer relative
            ${active === service.id ? "flex-[4]" : "flex-[1]"} 
            flex items-center justify-center`}
          onClick={() => setActive(service.id)}
        >
          {active === service.id ? (
            <div className="relative w-full h-96">
              <Image src={service.image} alt={service.title} fill className="object-cover" />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4">
                <p className="text-sm">{service.description}</p>
                <button className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-xl">
                  Explore
                </button>
              </div>
            </div>
          ) : (
            <div className="rotate-180 [writing-mode:vertical-rl] text-lg font-bold">
              {service.title}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
