import { Moon, Heart, User } from "lucide-react";
import { Poppins } from "next/font/google";
import ScrollSpyNav from "./scrollSpyNav";
import Testimonials from "./Component/Testimonial/Testimonials";
import Services from "./Component/Services/Services";
import WhyChooseUs from "./Component/WhyChooseUs";
import FeaturedServices from "./Component/FeaturedServices.js";
import Footer from "./Component/Footer.js";
import NeedAHelp from "./Component/NeedAHelp.js";
import BookAFlight from "./Component/BookAFlight.js";


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
            India,s first comprehensive flight Discovery Platform
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

        {/* Gradient fade to smooth transition */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-b from-[#032B41] to-[#FCEFE8] pointer-events-none" />
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Testimonials */}
      <Testimonials />


      <FeaturedServices />

      {/* <section
        id="aerial"
        className="h-screen flex items-center justify-center bg-white"
      >
        <h2 className="text-4xl font-bold text-gray-800">Aerial Services</h2>
      </section> */}

      {/* Pilgrimage Flights Section */}
      {/* <section
        id="pilgrimage"
        className="h-screen flex items-center justify-center bg-gray-200"
      >
        <h2 className="text-4xl font-bold text-gray-800">Pilgrimage Flights</h2>
      </section> */}

      <BookAFlight />

      <NeedAHelp />

      <Footer />

      {/* Right-side scroll navigation */}
      <ScrollSpyNav />
    </div>
  );
}
