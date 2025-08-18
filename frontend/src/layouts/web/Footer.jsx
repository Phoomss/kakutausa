import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-red-900 text-white pt-12">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* US Office */}
        <div className="space-y-4">
          <h4 className="font-bold text-xl">US Office</h4>
          <p className="flex items-start gap-3">
            <MapPin size={20} className="mt-1 text-red-200" />
            27795 Avenue Hopkins, Valencia CA, 91355
          </p>
          <p className="flex items-center gap-3">
            <Phone size={20} className="text-red-200" />
            661-295-2929 | 661-295-0909 (Fax)
          </p>
          <p className="flex items-center gap-3">
            <Mail size={20} className="text-red-200" />
            <a href="mailto:sales@allamericanbushing.com" className="hover:text-red-300 transition-colors">
              sales@allamericanbushing.com
            </a>
          </p>
        </div>

        {/* Japan Office */}
        <div className="space-y-4">
          <h4 className="font-bold text-xl">Japan Office</h4>
          <p className="flex items-start gap-3">
            <MapPin size={20} className="mt-1 text-red-200" />
            2-16-22 Dogashiba, Tennoji-ku, Osaka
          </p>
          <p className="flex items-center gap-3">
            <Phone size={20} className="text-red-200" />
            (06) 6772-6801 | (06) 6772-6871 (Fax)
          </p>
          <p className="flex items-center gap-3">
            <Mail size={20} className="text-red-200" />
            <a href="mailto:clamp@kakutakogyo.com" className="hover:text-red-300 transition-colors">
              clamp@kakutakogyo.com
            </a>
          </p>
        </div>

        {/* Quicklinks */}
        <div className="space-y-4">
          <h4 className="font-bold text-xl">Quicklinks</h4>
          <ul className="space-y-2">
            <li>
              <a href="/products" className="hover:text-red-300 transition-colors">
                Products
              </a>
            </li>
            <li>
              <a href="/cross-reference" className="hover:text-red-300 transition-colors">
                Cross Reference
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-red-300 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refunds-returns" className="hover:text-red-300 transition-colors">
                Refunds & Returns Policy
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-red-300 transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-12 pb-6 border-t border-red-700">
        Copyright © 2015-2025 Kakuta Co. USA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
