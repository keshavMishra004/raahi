"use client";
import BookingTabs from "./BookingTabs";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[600px] flex flex-col justify-between bg-gradient-to-b from-blue-900/80 to-blue-700/80">
      <div className="absolute inset-0 z-0">
        <img
          src="/img/hero-default.jpg"
          alt="Aviation Hero"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>
      <nav className="relative z-10 flex items-center justify-between px-8 pt-8">
        <div className="text-2xl font-bold text-white tracking-wide">RAAHi</div>
        <ul className="flex gap-8 text-white/90 font-medium">
          <li className="hover:text-white transition">Home</li>
          <li className="hover:text-white transition">Services</li>
          <li className="hover:text-white transition">Destinations</li>
          <li className="hover:text-white transition">About</li>
          <li className="hover:text-white transition">Contact</li>
        </ul>
      </nav>
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-16">
        <BookingTabs />
      </div>
    </section>
  );
}
