import React, { useEffect, useState } from "react";
import heroImage from "/hero.webp"; // รูป fallback
import contentService from "../../services/contentServices";

const Hero = () => {
  const [hero, setHero] = useState([]);

  const fetchHero = async () => {
    try {
      const res = await contentService.searchContentsByType("hero");
      setHero(res.data.data || []);
    } catch (err) {
      console.error("Failed to load hero content", err);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const heroEN = hero.find((item) => item.language === "en");

  const highlightRed = (text, keyword) => {
    if (!text) return "";
    const parts = text.split(new RegExp(`(${keyword})`, "gi")); // swap keyword
    return parts.map((part, idx) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={idx} className="text-red-600">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <section
      className="relative min-h-[75vh] flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${heroEN?.imageUrl || heroImage})` }}
    >
      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/75 to-transparent -z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-12">
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left space-y-6 animate-fadeIn text-white max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold tracking-wider uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Original Japanese Quality
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
            {heroEN?.title
              ? highlightRed(heroEN.title, "Kakuta Toggle Clamps")
              : <>Discover <span className="text-red-500">Kakuta Toggle Clamps</span></>}
          </h1>

          <p className="text-lg lg:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0 whitespace-pre-line leading-relaxed font-light">
            {heroEN?.detail
              ? highlightRed(heroEN.detail, "Kakuta Toggle Clamps")
              : "Originated in Japan, Kakuta has been providing top-quality toggle clamps for the automobile, aerospace, and manufacturing industries for over 65 years."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
            <a
              href="/about"
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-4 text-base font-semibold rounded-xl shadow-lg hover:shadow-red-600/30 hover:from-red-700 hover:to-red-600 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              Learn More
            </a>
            <a
              href="/contact"
              className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center"
            >
              Contact Us
            </a>
          </div>
        </div>

        {/* Floating Accent Feature Card - Desktop Only */}
        <div className="hidden lg:flex flex-col gap-4 w-80 bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-2xl text-white">
          <h3 className="text-lg font-bold text-red-500 border-b border-white/10 pb-2">Why Kakuta?</h3>
          <div className="space-y-4 pt-2">
            {[
              { title: "Established 1959", desc: "Over 65 years of engineering excellence." },
              { title: "Automotive Standard", desc: "Trusted by Toyota, Honda, Nissan & more." },
              { title: "Superior Durability", desc: "Made with premium materials for maximum lifecycle." }
            ].map((feature, i) => (
              <div key={i} className="space-y-1">
                <h4 className="text-sm font-semibold">{feature.title}</h4>
                <p className="text-xs text-gray-400 font-light leading-normal">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;