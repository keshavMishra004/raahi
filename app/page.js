// "use client";
// import { Moon, Heart, User, Plane } from "lucide-react";
// import { Poppins } from "next/font/google";
// import ScrollSpyNav from "./scrollSpyNav";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// export default function Home() {
//   return (
//     <div className="min-h-screen  flex flex-col">
//       {/* Navbar */}
//       <nav className="bg-orange-500 text-white px-6 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-2 font-bold text-xl">
//           <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center">
//             ✈
//           </span>
//           RAAHi
//         </div>

//         {/* Links */}
          
//         <ul className="flex gap-30 font-bold font-serif  text-white">
//           <li className="cursor-pointer transition duration-300 hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-200 hover:to-white">
//             Fly Bharat (UDAN)
//           </li>
//           <li className="cursor-pointer transition duration-300 hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-200 hover:to-white">
//             Charters
//           </li>
//           <li className="cursor-pointer transition duration-300 hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-200 hover:to-white">
//             Aerial Services
//           </li>
//           <li className="cursor-pointer transition duration-300 hover:scale-110 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-yellow-200 hover:to-white">
//             Pilgrimage Flights
//           </li>
//         </ul>

//         {/* Icons */}
//         <div className="flex items-center gap-4 text-lg">
//           <Moon className="cursor-pointer" />
//           <Heart className="cursor-pointer" />
//           <User className="cursor-pointer" />
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section
//         className="relative flex-1 flex items-center justify-center text-center text-white"
//         style={{
//           backgroundImage: "url('/aero-plane-bg.png')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
        
//         {/* Dark overlay */}
//         <div className="absolute inset-0 bg-black/40"></div>

//         <div className="relative z-10 px-4">
//           <div className="inline-block bg-teal-100 text-teal-900 px-4 py-1 mb-4 rounded-full text-sm font-medium">
//              India's first comprehensive flight Discovery Platform
//           </div>

//           <h1 className="text-4xl md:text-6xl font-bold mb-4">
//             Fly Smarter. Fly Anywhere. Fly Bharat.
//           </h1>
//           <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
//             From UDAN flights to private charters, aerial adventures, and
//             spiritual journeys — your sky experience starts here.
//           </p>
//           <div className="flex gap-6 justify-center">
//             <button className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-lg shadow-lg font-medium">
//               Book a Flight
//             </button>
//             <button className="bg-teal-700 hover:bg-teal-800 px-6 py-3 rounded-lg shadow-lg font-medium">
//               Explore Services
//             </button>
//           </div>
//         </div>

//         {/* Right side vertical nav */}
//         <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
//           <button className="bg-blue-900 text-white p-3 rounded-lg shadow">
//             <Plane size={20} />
//           </button>
//           <div className="flex flex-col gap-2 items-center">
//             {Array(5)
//               .fill(0)
//               .map((_, i) => (
//                 <span
//                   key={i}
//                   className="w-2 h-2 rounded-full bg-white/70 hover:bg-white cursor-pointer"
//                 ></span>
//               ))}
//           </div>
//         </div>
//       </section>
//       <section>
//         <h2>Page 2</h2>
//         <div>
//           <p>Hiii</p>
//         </div>
//       </section>
//         <ScrollSpyNav />
//     </div>
//   );
// }

"use client";
import { Moon, Heart, User } from "lucide-react";
import { Poppins } from "next/font/google";
import ScrollSpyNav from "./scrollSpyNav";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  return (
    <div className={`${poppins.className} min-h-screen flex flex-col`}>
      {/* Navbar */}
      <nav className="bg-orange-500 text-white px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 font-serif text-2xl">
          <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center">
            ✈
          </span>
          RAAHi
        </div>

        {/* Links */}
        <ul className="flex space-x-8 font-semibold gap-30 ">
          <li className="cursor-pointer hover:text-yellow-200 ">
            Fly Bharat (UDAN)
          </li>
          <li className="cursor-pointer hover:text-yellow-200">Charters</li>
          <li className="cursor-pointer hover:text-yellow-200">Aerial Services</li>
          <li className="cursor-pointer hover:text-yellow-200">
            Pilgrimage Flights
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4 text-lg">
          <Moon className="cursor-pointer" />
          <Heart className="cursor-pointer" />
          <User className="cursor-pointer" />
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex items-center justify-center text-center text-white"
        style={{
          height: "calc(100vh - 72px)", // adjust 72px its navbar height
          backgroundImage: "url('/aero-plane-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 px-4">
          <div className="inline-block bg-teal-100 text-teal-900 px-4 py-1 mb-70 rounded-full text-sm font-medium">
            India's first comprehensive flight Discovery Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Fly Smarter. Fly Anywhere. Fly Bharat.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            From UDAN flights to private charters, aerial adventures, and
            spiritual journeys — your sky experience starts here.
          </p>
          <div className="flex gap-6 justify-center">
            <button className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-2xl shadow-md font-medium">
              Book a Flight
            </button>
            <button className="bg-teal-700 hover:bg-teal-800 px-6 py-3 rounded-2xl shadow-md font-medium">
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* Charters Section */}
      <section
        id="charters"
        className="h-screen flex items-center justify-center bg-gray-100"
      >
        <h2 className="text-4xl font-bold text-gray-800">Charters</h2>
      </section>

      {/* Aerial Services Section */}
      <section
        id="aerial"
        className="h-screen flex items-center justify-center bg-white"
      >
        <h2 className="text-4xl font-bold text-gray-800">Aerial Services</h2>
      </section>

      {/* Pilgrimage Flights Section */}
      <section
        id="pilgrimage"
        className="h-screen flex items-center justify-center bg-gray-200"
      >
        <h2 className="text-4xl font-bold text-gray-800">Pilgrimage Flights</h2>
      </section>

      {/* Right-side scroll navigation */}
      <ScrollSpyNav />
    </div>
  );
}
