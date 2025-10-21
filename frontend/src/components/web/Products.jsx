import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { API_IMAGE_URL } from "../../configs/constants";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productService.getAllProducts();
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.data.data) {
          setCategories(["All", ...res.data.data.map((c) => c.name)]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
        (p) =>
          p.category?.name === selectedCategory || p.category === selectedCategory
      );

  const handleOnClick = (product) => {
    navigate(`/products/${product.id}`);
  };

  if (loading) return <p className="text-center py-10">Loading products...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Banner */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Our Products
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Browse categories and find the perfect product
        </p>
      </div>

      {/* Category Select */}
      <div className="flex justify-start mb-10">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select select-bordered w-full max-w-xs border-red-600"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>


      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col group"
          >
            {/* Image */}
            <div className="relative w-full h-72 overflow-hidden rounded-t-3xl">
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

      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products in this category.
        </p>
      )}
    </div>
  );
};

export default Products;
