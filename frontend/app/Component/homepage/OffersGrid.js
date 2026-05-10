"use client";
const OFFERS = [
  { title: "10% Off on First Charter", desc: "Book your first private charter and get 10% off.", img: "/img/offer1.jpg" },
  { title: "Summer Sports Sale", desc: "Special rates for aerial sports this summer.", img: "/img/offer2.jpg" },
  { title: "Pilgrimage Special", desc: "Exclusive deals on pilgrimage flights.", img: "/img/offer3.jpg" },
  { title: "Empty Leg Deals", desc: "Save big on empty leg flights.", img: "/img/offer4.jpg" },
  { title: "Group Booking Bonus", desc: "Extra perks for group bookings.", img: "/img/offer5.jpg" },
  { title: "Refer & Earn", desc: "Refer friends and earn rewards.", img: "/img/offer6.jpg" },
];

export default function OffersGrid() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Offers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <div
              key={offer.title}
              className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer bg-white hover:shadow-2xl transition-shadow duration-300"
            >
              <img src={offer.img} alt={offer.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-700 transition-colors duration-200">{offer.title}</h3>
                <p className="text-gray-600 text-sm">{offer.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
