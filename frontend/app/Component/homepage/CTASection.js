"use client";
const CTA_IMAGES = [
  "/img/cta-paragliding.jpg",
  "/img/cta-temple.jpg",
  "/img/cta-cabin.jpg",
];

export default function CTASection() {
  return (
    <section className="relative w-full h-72 md:h-96 flex items-center justify-center">
      <img
        src={CTA_IMAGES[0]}
        alt="CTA Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
      />
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full">
        <button className="bg-white/90 hover:bg-blue-700 hover:text-white text-blue-700 font-bold px-8 py-4 rounded-full text-lg shadow-xl transition-all duration-200">
          Book a Flight Now
        </button>
      </div>
    </section>
  );
}
