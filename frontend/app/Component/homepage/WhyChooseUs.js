"use client";
const FEATURES = [
  { icon: "🚀", title: "Fastest Booking", desc: "Book flights in minutes with instant confirmation." },
  { icon: "🛡️", title: "Safety First", desc: "Strictest safety protocols and certified operators." },
  { icon: "💸", title: "Transparent Pricing", desc: "No hidden fees. Clear, upfront pricing." },
  { icon: "🌏", title: "Pan-India Network", desc: "Access to 100+ destinations across India." },
  { icon: "🕑", title: "24/7 Support", desc: "Always-on customer support for all your needs." },
];

export default function WhyChooseUs() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Why Choose Us</h2>
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="flex flex-col items-center bg-white rounded-2xl shadow-md p-6 flex-1 min-w-[180px] hover:shadow-xl transition-shadow duration-300"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <div className="font-semibold text-lg mb-1 text-gray-900">{f.title}</div>
              <div className="text-gray-600 text-sm text-center">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
