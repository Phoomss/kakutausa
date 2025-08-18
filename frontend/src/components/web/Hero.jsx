import React from "react";
import heroImage from "/hero.webp"; // เปลี่ยนเป็น path รูปของคุณ

const Hero = () => {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-50 via-white to-red-100 -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8 py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
        
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
            Discover <span className="text-red-600">Kakuta Toggle Clamps</span>
          </h1>
          <p className="text-gray-700 text-lg lg:text-xl">
            Originated in Japan, Kakuta has been providing top-quality toggle clamps 
            for the automobile, aerospace, and manufacturing industries for over 65 years.
          </p>
          <div className="flex justify-center lg:justify-start gap-4 mt-6">
            <button className="btn bg-red-600 text-white px-6 py-3 text-lg font-semibold shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105">
              Learn More
            </button>
            <button className="btn btn-outline border-red-600 text-red-600 px-6 py-3 text-lg font-semibold hover:bg-red-50 transition">
              Contact Us
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1 relative">
          <img
            src={heroImage}
            alt="Kakuta Products"
            className="w-full h-auto rounded-xl shadow-2xl transform transition-transform duration-500 hover:scale-105"
          />
          {/* Optional overlay effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-transparent via-white/30 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
