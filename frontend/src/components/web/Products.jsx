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
        // console.error(err);
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
        // console.error(err);
        setError("Failed to load categories");
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
            onClick={() => handleOnClick(product)}
            className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-transform relative"
          >
            <img
              src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
              alt={product.name}
              className="w-full h-52 object-cover"
            />
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
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
