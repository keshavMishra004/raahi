
// import { Moon, Heart, User } from "lucide-react";
// import { Poppins } from "next/font/google";
// import ScrollSpyNav from "./scrollSpyNav";
// import Testimonials from "./Component/Testimonial/Testimonials";
// import Services from "./Component/Services/Services";
// import WhyChooseUs from "./Component/WhyChooseUs";


// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// export default function Home() {
//   return (
//     <div className={`${poppins.className} min-h-screen flex flex-col`}>
//       {/* Navbar */}
//       <nav className="bg-orange-500 text-white px-8 py-4 flex items-center justify-between">
//         {/* Logo */}
//         <div className="flex items-center gap-2 font-serif text-2xl">
//           <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center">
//             ✈
//           </span>
//           RAAHi
//         </div>

//         {/* Links */}
//         <ul className="flex space-x-8 font-semibold gap-30 ">
//           <li className="cursor-pointer hover:text-yellow-200 ">
//             Fly Bharat (UDAN)
//           </li>
//           <li className="cursor-pointer hover:text-yellow-200">Charters</li>
//           <li className="cursor-pointer hover:text-yellow-200">Aerial Services</li>
//           <li className="cursor-pointer hover:text-yellow-200">
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
//         id="hero"
//         className="relative flex items-center justify-center text-center text-white"
//         style={{
//           height: "calc(100vh - 72px)", // adjust 72px its navbar height
//           backgroundImage: "url('/air-plane-bg.jpeg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="relative z-10 px-4">
//           <div className="inline-block bg-teal-100 text-teal-900 px-4 py-1 mb-70 rounded-full text-sm font-medium">
//             India's first comprehensive flight Discovery Platform
//           </div>

//           <h1 className="text-5xl md:text-6xl font-bold mb-4">
//             Fly Smarter. Fly Anywhere. Fly Bharat.
//           </h1>
//           <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
//             From UDAN flights to private charters, aerial adventures, and
//             spiritual journeys — your sky experience starts here.
//           </p>
//           <div className="flex gap-6 justify-center">
//             <button className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-2xl shadow-md font-medium">
//               Book a Flight
//             </button>
//             <button className="bg-teal-700 hover:bg-teal-800 px-6 py-3 rounded-2xl shadow-md font-medium">
//               Explore Services
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Charters Section */}
//       <Services/>
//       {/* <section
//         id="charters"
//         className="h-screen flex items-center justify-center bg-gray-100"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Charters</h2>
//       </section>
      
//       <Testimonials/>

//       {/* Aerial Services Section */}

//       <WhyChooseUs/>

//       <Testimonials/>
//       <section
//         id="aerial"
//         className="h-screen flex items-center justify-center bg-white"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Aerial Services</h2>
//       </section>

//       {/* Pilgrimage Flights Section */}
//       <section
//         id="pilgrimage"
//         className="h-screen flex items-center justify-center bg-gray-200"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Pilgrimage Flights</h2>
//       </section>

//       {/* Right-side scroll navigation */}
//       <ScrollSpyNav />
//     </div>
//   );
// }

// import { Moon, Heart, User } from "lucide-react";
// import { Poppins } from "next/font/google";
// import ScrollSpyNav from "./scrollSpyNav";
// import Testimonials from "./Component/Testimonial/Testimonials";
// import Services from "./Component/Services/Services";
// import WhyChooseUs from "./Component/WhyChooseUs";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// export default function Home() {
//   return (
//     <div className={`${poppins.className} min-h-screen flex flex-col`}>
//       {/* Navbar */}
//       <nav className="fixed top-0 left-0 w-full z-50 bg-orange-700/80 backdrop-blur-md text-white px-8 py-4 flex items-center justify-between shadow-lg">
//         {/* Logo */}
//         <div className="flex items-center gap-2 font-serif text-2xl cursor-pointer hover:scale-105 transition-transform duration-300">
//           <span className="bg-white text-orange-500 rounded-full w-9 h-9 flex items-center justify-center shadow-md">
//             ✈
//           </span>
//           <span className="tracking-wide font-bold">RAAHi</span>
//         </div>

//         {/* Links */}
//         <ul className="hidden md:flex space-x-10 font-medium">
//           {["Fly Bharat (UDAN)", "Charters", "Aerial Services", "Pilgrimage Flights"].map((item, idx) => (
//             <li key={idx} className="cursor-pointer relative group">
//               <span className="hover:text-yellow-200 transition-colors duration-300">
//                 {item}
//               </span>
//               {/* underline animation */}
//               <span className="absolute left-0 bottom-[-6px] w-0 h-[2px] bg-yellow-200 transition-all duration-300 group-hover:w-full"></span>
//             </li>
//           ))}
//         </ul>

//         {/* Icons */}
//         <div className="flex items-center gap-5 text-lg">
//           {[Moon, Heart, User].map((Icon, i) => (
//             <Icon
//               key={i}
//               className="cursor-pointer hover:scale-125 hover:text-yellow-200 transition-all duration-300"
//             />
//           ))}
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section
//         id="hero"
//         className="relative flex items-center justify-center text-center text-white"
//         style={{
//           height: "100vh",
//           backgroundImage: "url('/air-plane-bg.jpeg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* gradient overlay for blending */}
//         <div className="absolute inset-0 bg-gradient-to-b from-orange-900/60 via-black/50 to-black/80"></div>

//         <div className="relative z-10 px-4 animate-fadeIn">
//           <div className="inline-block bg-teal-100/90 text-teal-900 px-5 py-1 mb-8 rounded-full text-sm font-medium shadow-md animate-slideDown">
//             India&apos;s first comprehensive flight Discovery Platform
//           </div>

//           <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-lg animate-slideUp">
//             Fly Smarter. Fly Anywhere. <br /> Fly Bharat.
//           </h1>

//           <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-gray-200 animate-fadeIn delay-300">
//             From UDAN flights to private charters, aerial adventures, and
//             spiritual journeys — your sky experience starts here.
//           </p>

//           <div className="flex gap-6 justify-center">
//             <button className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 px-8 py-3 rounded-2xl shadow-lg font-medium transition-all duration-300 hover:scale-105">
//               Book a Flight
//             </button>
//             <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 px-8 py-3 rounded-2xl shadow-lg font-medium transition-all duration-300 hover:scale-105">
//               Explore Services
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Charters Section */}
//       <Services />
//       <WhyChooseUs />
//       <Testimonials />

//       {/* Aerial Services Section */}
//       <section
//         id="aerial"
//         className="h-screen flex items-center justify-center bg-white"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Aerial Services</h2>
//       </section>

//       {/* Pilgrimage Flights Section */}
//       <section
//         id="pilgrimage"
//         className="h-screen flex items-center justify-center bg-gray-200"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Pilgrimage Flights</h2>
//       </section>

//       {/* Right-side scroll navigation */}
//       <ScrollSpyNav />
//     </div>
//   );
// }

// import { Moon, Heart, User } from "lucide-react";
// import { Poppins } from "next/font/google";
// import ScrollSpyNav from "./scrollSpyNav";
// import Testimonials from "./Component/Testimonial/Testimonials";
// import Services from "./Component/Services/Services";
// import WhyChooseUs from "./Component/WhyChooseUs";


// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "500", "600"],
// });

// export default function Home() {
//   return (
//     <div className={`${poppins.className} min-h-screen flex flex-col`}>
//       {/* Navbar */}
//       <nav className="fixed top-0 left-0 w-full z-50 bg-orange-700/80 backdrop-blur-md text-white px-8 py-4 flex items-center justify-between shadow-lg">
//         {/* Logo */}
//         <div className="flex items-center gap-2 font-serif text-2xl cursor-pointer hover:scale-105 transition-transform duration-300">
//           <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
//             ✈
//           </span>
//           RAAHi
//         </div>

//         {/* Links */}
//         <ul className="flex space-x-8 font-semibold">
//           <li className="cursor-pointer relative group">
//             Fly Bharat (UDAN)
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
//           </li>
//           <li className="cursor-pointer relative group">
//             Charters
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
//           </li>
//           <li className="cursor-pointer relative group">
//             Aerial Services
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
//           </li>
//           <li className="cursor-pointer relative group">
//             Pilgrimage Flights
//             <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
//           </li>
//         </ul>

//         {/* Icons */}
//         <div className="flex items-center gap-4 text-lg">
//           <Moon className="cursor-pointer hover:scale-110 transition-transform" />
//           <Heart className="cursor-pointer hover:scale-110 transition-transform" />
//           <User className="cursor-pointer hover:scale-110 transition-transform" />
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section
//         id="hero"
//         className="relative flex items-center justify-center text-center text-white"
//         style={{
//           height: "100vh",
//           backgroundImage: "url('/air-plane-bg.jpeg')",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         {/* Dark Overlay with Blend */}
//         <div className="absolute inset-0 bg-gradient-to-b from-orange-900/60 via-black/70 to-[#032B41]"></div>

//         <div className="relative z-10 px-4 mt-16">
//           <div className="inline-block bg-teal-100 text-teal-900 px-4 py-1 mb-8 rounded-full text-sm font-medium shadow-md">
//             India's first comprehensive flight Discovery Platform
//           </div>

//           <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
//             Fly Smarter. Fly Anywhere. Fly Bharat.
//           </h1>
//           <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
//             From UDAN flights to private charters, aerial adventures, and
//             spiritual journeys — your sky experience starts here.
//           </p>
//           <div className="flex gap-6 justify-center">
//             <button className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-2xl shadow-md font-medium transition-transform hover:scale-105">
//               Book a Flight
//             </button>
//             <button className="bg-teal-700 hover:bg-teal-800 px-6 py-3 rounded-2xl shadow-md font-medium transition-transform hover:scale-105">
//               Explore Services
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Charters / Services Section */}
//       <Services/>

      
//       <WhyChooseUs />

//       <Testimonials />

//       {/* Aerial Services Section */}
//       <section
//         id="aerial"
//         className="h-screen flex items-center justify-center bg-white"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Aerial Services</h2>
//       </section>

//       {/* Pilgrimage Flights Section */}
//       <section
//         id="pilgrimage"
//         className="h-screen flex items-center justify-center bg-gray-200"
//       >
//         <h2 className="text-4xl font-bold text-gray-800">Pilgrimage Flights</h2>
//       </section>

//       {/* Right-side scroll navigation */}
//       <ScrollSpyNav />
//     </div>
//   );
// }

import { Moon, Heart, User } from "lucide-react";
import { Poppins } from "next/font/google";
import ScrollSpyNav from "./scrollSpyNav";
import Testimonials from "./Component/Testimonial/Testimonials";
import Services from "./Component/Services/Services";
import WhyChooseUs from "./Component/WhyChooseUs";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function Home() {
  return (
    <div className={`${poppins.className} min-h-screen flex flex-col`}>
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-orange-700/80 backdrop-blur-md text-white px-8 py-4 flex items-center justify-between shadow-lg">
        {/* Logo */}
        <div className="flex items-center gap-2 font-serif text-2xl cursor-pointer hover:scale-105 transition-transform duration-300">
          <span className="bg-white text-orange-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md">
            ✈
          </span>
          RAAHi
        </div>

        {/* Links */}
        <ul className="flex space-x-8 font-semibold">
          <li className="cursor-pointer relative group">
            Fly Bharat (UDAN)
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
          </li>
          <li className="cursor-pointer relative group">
            Charters
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
          </li>
          <li className="cursor-pointer relative group">
            Aerial Services
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
          </li>
          <li className="cursor-pointer relative group">
            Pilgrimage Flights
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-yellow-300 transition-all group-hover:w-full"></span>
          </li>
        </ul>

        {/* Icons */}
        <div className="flex items-center gap-4 text-lg">
          <Moon className="cursor-pointer hover:scale-110 transition-transform" />
          <Heart className="cursor-pointer hover:scale-110 transition-transform" />
          <User className="cursor-pointer hover:scale-110 transition-transform" />
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative flex items-center justify-center text-center text-white"
        style={{
          height: "100vh",
          backgroundImage: "url('/air-plane-bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay with Blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/60 via-black/70 to-[#032B41]"></div>

        <div className="relative z-10 px-4 mt-16">
          <div className="inline-block bg-teal-100 text-teal-900 px-4 py-1 mb-8 rounded-full text-sm font-medium shadow-md">
            India's first comprehensive flight Discovery Platform
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Fly Smarter. Fly Anywhere. Fly Bharat.
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-200">
            From UDAN flights to private charters, aerial adventures, and
            spiritual journeys — your sky experience starts here.
          </p>
          <div className="flex gap-6 justify-center">
            <button className="bg-teal-600 hover:bg-teal-700 px-6 py-3 rounded-2xl shadow-md font-medium transition-transform hover:scale-105">
              Book a Flight
            </button>
            <button className="bg-teal-700 hover:bg-teal-800 px-6 py-3 rounded-2xl shadow-md font-medium transition-transform hover:scale-105">
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* Charters / Services Section */}
      <section className="relative">
        <Services />

        {/* 👇 Gradient fade to smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-[#032B41] to-[#FCEFE8] pointer-events-none" />
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />

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
