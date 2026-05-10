"use client";
export default function HelpSection() {
  return (
    <section className="py-12 bg-white flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h3>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Our support team is available 24/7 to assist you with bookings, queries, and more.
      </p>
      <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-8 py-3 rounded-xl shadow transition-all duration-200">
        Contact Support
      </button>
    </section>
  );
}
