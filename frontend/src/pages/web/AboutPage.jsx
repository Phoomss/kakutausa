import React, { useEffect, useState } from "react";
import aboutImage from "/about.webp"; 
import contentService from "../../services/contentServices";
import addressService from "../../services/addressService";

const AboutPage = () => {
  const [about, setAbout] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAbout = async () => {
    try {
      const res = await contentService.searchContentsByType("about");
      setAbout(res.data.data || []);
    } catch (err) {
      console.error("Failed to load about content", err);
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAllAddress();
      setAddresses(res.data.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchAbout(), fetchAddresses()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const aboutEN = about.find((item) => item.language === "en");
  const aboutJA = about.find((item) => item.language === "ja");

  const usOffice = addresses.find(
    (addr) =>
      addr.name?.toLowerCase().includes("us office") ||
      addr.country?.toLowerCase() === "united states"
  );

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-16 flex flex-col lg:flex-row items-center gap-12">

        {/* Left Content */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
            {aboutEN?.title || "About Kakuta"}
          </h1>

          {/* English Detail */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {aboutEN?.detail || "Originated in Japan, Kakuta was established in 1959 to serve the leading Japanese automobile manufacturing industry. Kakuta toggle clamps have been widely recognized among Japanese automobile assembly plants including Toyota, Nissan, Honda, and Mitsubishi."}
              </p>
              <p className="text-gray-700 leading-relaxed font-semibold mt-4">
                For United States customers: please call{" "}
                <span className="text-red-600">
                  {usOffice?.phone1 || "661-295-2929"}
                </span>{" "}
                or email{" "}
                <a
                  href={`mailto:${usOffice?.email || "sales@allamericanbushing.com"}`}
                  className="text-red-600 underline"
                >
                  {usOffice?.email || "sales@allamericanbushing.com"}
                </a>
                .
              </p>
            </div>
          )}

          {/* Japanese Detail */}
          {aboutJA && (
            <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {aboutJA.title}
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {aboutJA.detail}
              </p>
            </div>
          )}

          {/* Contact Us Button */}
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
            src={aboutEN?.imageUrl || aboutImage}
            alt={aboutEN?.title || "About Kakuta"}
            className="rounded-xl shadow-lg max-w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
