import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown
} from 'lucide-react';
import logo from "/logo.webp";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Home',
    'About',
    {
      name: 'Products',
      submenu: ['All Product', 'Air Clamp', 'Horizontal Handle']
    },
    'Contact Us'
  ];

  return (
    <div className="w-full">
      {/* Contact Banner */}
      <div className="bg-red-600 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>US Office: 661-295-2929</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Fax: 661-295-0909</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Japan Office: (06) 6772-6801</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <a href="/" className="flex items-center">
                <img src={logo} alt="Logo" className="h-10 w-auto" />
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {categories.map((category, index) => (
                <div key={index} className="relative group">
                  {typeof category === 'string' ? (
                    <button className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative">
                      {category}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                    </button>
                  ) : (
                    <div>
                      <button
                        className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 relative flex items-center"
                        onMouseEnter={() => setIsProductsMenuOpen(true)}
                        onMouseLeave={() => setIsProductsMenuOpen(false)}
                      >
                        {category.name}
                        <ChevronDown className="w-4 h-4 ml-1" />
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                      </button>

                      {isProductsMenuOpen && (
                        <div
                          className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-2 z-50"
                          onMouseEnter={() => setIsProductsMenuOpen(true)}
                          onMouseLeave={() => setIsProductsMenuOpen(false)}
                        >
                          {category.submenu.map((item, subIndex) => (
                            <a
                              key={subIndex}
                              href="#"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200"
                            >
                              {item}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {categories.map((category, index) => (
                <div key={index}>
                  {typeof category === 'string' ? (
                    <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200">
                      {category}
                    </button>
                  ) : (
                    <div>
                      <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200 font-medium">
                        {category.name}
                      </button>
                      <div className="ml-4 space-y-1">
                        {category.submenu.map((item, subIndex) => (
                          <button
                            key={subIndex}
                            className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;