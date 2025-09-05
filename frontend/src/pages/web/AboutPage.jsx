import React, { useState } from "react";
import aboutImage from "/about.webp"; // เปลี่ยนเป็น path รูปจริงของคุณ

const AboutPage = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-16 flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Content */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            About Kakuta
          </h1>
          <p className="text-gray-700 leading-relaxed">
            Originated in Japan, Kakuta was established in 1959 to serve the leading Japanese automobile manufacturing industry. Both Kakuta manual and air clamps have been technically designed and recognized among Japanese automobile assembly plants including Toyota, Nissan, Honda, and Mitsubishi.
          </p>
          <p className="text-gray-700 leading-relaxed">
            With nearly 65 years of industry experience, Kakuta toggle clamps have been further developed and designed to meet global industry standards to solve your workholding solutions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Kakuta toggle clamps also serve a wide range of applications including wielding, injection molding, aerospace, automobile, manufacturing assembly, woodworking and other related industries.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Along with Japanese overseas investment, Kakuta has two regional facilities in the United States and Thailand. Additionally, Kakuta has representatives and distributors throughout the world to serve North America, Europe, and Asia.
          </p>
          <p className="text-gray-700 leading-relaxed font-semibold">
            For United States customers: please call <span className="text-red-600">661-295-2929</span> or email <a href="mailto:sales@allamericanbushing.com" className="text-red-600 underline">sales@allamericanbushing.com</a>.
          </p>

          {/* Japanese Section */}
          <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">会社案内</h2>
            <p className="text-gray-700 leading-relaxed">
              カクタの各種トグルクランプは溶接治具、検査治具、検査装置、固定金具などとして日本を代表する多くの企業に採用されており分野としましては、自動車・造船・航空機器・飛行機・鉄道車両・建設・化学工業・ゴム・通信機器・光学機器・重電機器・家庭用電気機器・・農業機械・原動機・重作業用機器・繊維・食品機器・電子部品等の様々な業界で省力化に貢献しています。
            </p>
          </div>

          <a
            href="/contact"
            className="inline-block mt-6 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Contact Us
          </a>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src={aboutImage}
            alt="About Kakuta"
            className="rounded-xl shadow-lg max-w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
