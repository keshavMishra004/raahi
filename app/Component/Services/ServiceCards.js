

// "use client";
// import { useState } from "react";
// import Image from "next/image";

// const servicesData = [
//   { id: "fly-bharat", title: "Fly Bharat (UDAN)", description: "Affordable regional flights.", image: "/fly-bharat.jpg" },
//   { id: "charters", title: "Charters", description: "Private, Air Ambulance, Empty Leg.", image: "/charters.jpeg" },
//   { id: "aerial", title: "Aerial Services", description: "Aero sports & tourism.", image: "/sky-diving.png" },
//   { id: "pilgrimage", title: "Pilgrimage Flights", description: "Spiritual journeys made easy.", image: "/pilgm.png" },
// ];

// export default function ServiceCards() {
//   const [active, setActive] = useState("fly-bharat");

//   return (
//     <div className="flex bg-white/10 rounded-2xl overflow-hidden">
//       {servicesData.map((service) => {
//         const isActive = active === service.id;

//         return (
//           <div
//             key={service.id}
//             className={`transition-all duration-500 cursor-pointer relative
//               ${isActive ? "flex-[4]" : "flex-[1]"} 
//               flex items-center justify-center 
//               border-b-4 border-r-4 border-white/20 
//               rounded-tr-2xl rounded-br-2xl 
//               shadow-[6px_6px_12px_rgba(0,0,0,0.5)]
//               ${!isActive ? "hover:shadow-[12px_12px_20px_rgba(0,0,0,0.7)] hover:border-white/40 hover:scale-[1.02]" : ""}`}
//             onClick={() => setActive(service.id)}
//           >
//             {isActive ? (
//               <div className="relative w-full h-96">
//                 <Image
//                   src={service.image}
//                   alt={service.title}
//                   fill
//                   className="object-cover rounded-2xl"
//                 />
//                 <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 rounded-b-2xl">
//                   <p className="text-sm">{service.description}</p>
//                   <button className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md hover:shadow-xl transition-all">
//                     Explore
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="rotate-180 [writing-mode:vertical-rl] text-lg font-bold text-white drop-shadow-md transition-transform duration-500 hover:scale-110">
//                 {service.title}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const servicesData = [
  { id: "fly-bharat", title: "Fly Bharat (UDAN)", description: "Affordable regional flights.", image: "/fly-bharat.jpg" },
  { id: "charters", title: "Charters", description: "Private, Air Ambulance, Empty Leg.", image: "/charters.jpeg" },
  { id: "aerial", title: "Aerial Services", description: "Aero sports & tourism.", image: "/sky-diving.png" },
  { id: "pilgrimage", title: "Pilgrimage Flights", description: "Spiritual journeys made easy.", image: "/pilgm.png" },
];

export default function ServiceCards() {
  const [active, setActive] = useState("fly-bharat");

  // observer for section
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // start animation when 20% of section is visible
  });

  return (
    <div ref={ref} className="flex bg-white/10 rounded-2xl overflow-hidden">
      {servicesData.map((service, index) => {
        const isActive = active === service.id;

        return (
          <motion.div
            key={service.id}
            initial={{ x: 600, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
            className={`transition-all duration-500 cursor-pointer relative
              ${isActive ? "flex-[4]" : "flex-[1]"} 
              flex items-center justify-center 
              border-b-4 border-r-4 border-white/20 
              rounded-tr-2xl rounded-br-2xl 
              shadow-[6px_6px_12px_rgba(0,0,0,0.5)]
              ${!isActive ? "hover:shadow-[12px_12px_20px_rgba(0,0,0,0.7)] hover:border-white/40 hover:scale-[1.02]" : ""}`}
            onClick={() => setActive(service.id)}
          >
            {isActive ? (
              <div className="relative w-full h-96">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover rounded-2xl"
                />
                <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4 rounded-b-2xl">
                  <p className="text-sm">{service.description}</p>
                  <button className="mt-3 px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md hover:shadow-xl transition-all">
                    Explore
                  </button>
                </div>
              </div>
            ) : (
              <div className="rotate-180 [writing-mode:vertical-rl] text-lg font-bold text-white drop-shadow-md transition-transform duration-500 hover:scale-110">
                {service.title}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}


