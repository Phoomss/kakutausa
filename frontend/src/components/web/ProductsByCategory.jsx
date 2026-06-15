import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { API_IMAGE_URL } from "../../configs/constants";

const ProductsGallery = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        setCategories(["All", ...(res.data.data?.map(c => c.name) || [])]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res =
          selectedCategory === "All"
            ? await productService.getAllProducts()
            : await productService.searchProductByCategory(selectedCategory);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error(err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return <p className="text-center py-20">Loading products...</p>;
  }

  return (
    <section className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm border ${selectedCategory === cat
                ? "bg-red-600 text-white border-red-600 shadow-red-650/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-red-300 hover:text-red-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                {/* Product Image Container */}
                <div className="relative aspect-square bg-slate-50 flex items-center justify-center p-4 overflow-hidden border-b border-slate-50">
                  <img
                    src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Subtle Accent Line */}
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 transition-all duration-300 group-hover:w-full"></div>
                </div>

                {/* Product Info Block */}
                <div className="p-5 bg-white flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-red-500 font-bold uppercase tracking-wider mb-1 block">
                      {product.category?.name || product.category || "Clamp"}
                    </span>
                    <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center text-red-600 text-xs font-bold mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                    <svg className="w-3.5 h-3.5 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
            <p className="text-slate-500 font-medium">
              No products found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsGallery;
