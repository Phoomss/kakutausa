import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import categoryService from "../../services/categoryService";
import { PRODUCTS_PATH } from './../../configs/constants';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getAllCategories();
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Product Categories
            </h2>
            <div className="w-16 h-1 bg-red-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-100 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return (
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Product Categories
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-8"></div>
          <p className="text-gray-600">No categories available at the moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Product Categories
          </h2>
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our comprehensive range of toggle clamps designed for various industrial applications
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, index) => (
            <NavLink
              key={cat.id}
              to={`${PRODUCTS_PATH}`}
              className="group block bg-white rounded-2xl border border-slate-100 hover:border-red-500/30 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 p-8 relative overflow-hidden transform hover:-translate-y-1"
            >
              {/* Background Accent Gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-red-500/5 to-transparent rounded-bl-full opacity-60 group-hover:scale-110 transition-transform duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  {/* Category Number Badge */}
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-xl text-sm font-bold mb-5 transition-all duration-300 group-hover:bg-red-600 group-hover:text-white shadow-sm">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="text-xl font-bold text-slate-850 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {cat.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {cat.description || "Specialized toggle clamps for your specific needs"}
                  </p>
                </div>
                
                {/* Action Link */}
                <div className="flex items-center text-red-600 text-sm font-semibold pt-2">
                  View Products
                  <svg 
                    className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform duration-300" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2.5" 
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </NavLink>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <NavLink
            to={PRODUCTS_PATH}
            className="inline-flex items-center px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-300"
          >
            View All Products
            <svg 
              className="w-5 h-5 ml-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </NavLink>
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default ProductCategories;