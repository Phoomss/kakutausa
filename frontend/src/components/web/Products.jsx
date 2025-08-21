import React, { useState } from "react";
import { useNavigate } from "react-router";
import product1 from "/products/HH150-2S.jpg";
import product2 from "/products/HH150.jpg";
import product3 from "/products/FA200.jpg";
const products = [
  {
    id: 1,
    name: "Air Clamp A-100",
    image: "https://via.placeholder.com/300x200",
    category: "Air Clamp"
  },
  {
    id: 2,
    name: "HH 150",
    image: product2,
    category: "Horizontal Handle"
  },
  {
    id: 3,
    name: "Quick Release Clamp Q-50",
    image: "https://via.placeholder.com/300x200",
    category: "Quick Release"
  },
  {
    id: 4,
    name: "HH 150-2S",
    image: product1,
    category: "Horizontal Handle"
  },
  {
    id: 5,
    name: "FA 200",
    image: product3,
    category: "Latch Type"
  }
];

const categories = [
  "All",
  "Horizontal Handle",
  "Latch Type",
  "Special Hold Down",
  "Squeeze Action",
  "Straight Line Action",
  "Vertical Handle"
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate(); // ✅ ใช้ useNavigate

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleOnClick = (product) => {
    console.log("Product clicked:", product);
    navigate(`/products/${product.id}`); // ✅ เด้งไป product details
  };

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
          className="select select-bordered w-full max-w-xs"
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
              src={product.image}
              alt={product.name}
              className="w-full h-52 object-cover"
            />

            {/* Product Info */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No products in this category.
        </p>
      )}
    </div>
  );
};

export default Products;
