import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { API_IMAGE_URL } from "../../configs/constants";

const ProductsByCategory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        const categoriesData = ["All", ...(res.data.data?.map(c => c.name) || [])];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products whenever selectedCategory changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let res;
        if (selectedCategory === "All") {
          res = await productService.getAllProducts();
        } else {
          res = await productService.searchProductByCategory(selectedCategory);
        }
        setProducts(res.data.data || []);
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12">
            Our <span className="text-red-600">Products by Category</span>
          </h2>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Our <span className="text-red-600">Products by Category</span>
        </h2>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${selectedCategory === cat
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-red-600 border border-red-200 hover:bg-red-50"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col group"
              >
                {/* Image */}
                <div className="relative w-full h-88 overflow-hidden rounded-t-3xl">
                  <img
                    src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 text-center">
                    {product.name}
                  </h4>

                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Category: {product.category?.name || "N/A"}
                  </p>

                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 w-full shadow-md hover:shadow-lg"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductsByCategory;
