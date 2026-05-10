"use client";
import HeroSection from "./Component/homepage/HeroSection";
import FeaturedDestinations from "./Component/homepage/FeaturedDestinations";
import OffersGrid from "./Component/homepage/OffersGrid";
import MapSection from "./Component/homepage/MapSection";
import WhyChooseUs from "./Component/homepage/WhyChooseUs";
import Testimonials from "./Component/homepage/Testimonials";
import CTASection from "./Component/homepage/CTASection";
import HelpSection from "./Component/homepage/HelpSection";
import Newsletter from "./Component/homepage/Newsletter";
import Footer from "./Component/homepage/Footer";

export default function Home() {
  return (
    <main className="bg-white min-h-screen flex flex-col">
      <HeroSection />
      <FeaturedDestinations />
      <OffersGrid />
      <MapSection />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <HelpSection />
      <Newsletter />
      <Footer />
    </main>
  );
}
