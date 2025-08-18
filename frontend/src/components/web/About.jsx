import React from "react";
import aboutImage from "/about.webp"; 

const AboutSection = () => {
  return (
    <section className="relative bg-white overflow-hidden py-20">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-50 via-white to-red-100 -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={aboutImage}
            alt="About Kakuta"
            className="rounded-xl shadow-2xl transform transition-transform duration-500 hover:scale-105 max-w-full h-auto object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            About <span className="text-red-600">Kakuta</span>
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Originated in Japan, Kakuta was established in 1959 to serve the leading Japanese automobile manufacturing industry. Kakuta toggle clamps have been widely recognized among Japanese automobile assembly plants including Toyota, Nissan, Honda, and Mitsubishi.
          </p>
          <p className="text-gray-700 leading-relaxed">
            With nearly 65 years of industry experience, Kakuta toggle clamps have been further developed and designed to meet global industry standards to solve your workholding solutions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our toggle clamps also serve a wide range of applications including welding, injection molding, aerospace, automobile, manufacturing assembly, woodworking, and other related industries.
          </p>
          <a
            href="/about"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
