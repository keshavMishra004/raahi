


import ServiceCards from "./ServiceCards";

export default function Services() {
  return (
    <section className="bg-[#032B41] text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">OUR SERVICES</h2>
        <p className="text-gray-300 mb-8 max-w-2xl">
          From Udaan flights to exclusive charter flights and pilgrimage helicopters. 
          RAAHi makes every flight option discoverable, bookable, and efficient.
        </p>

        <ServiceCards />
      </div>
    </section>
  );
}

