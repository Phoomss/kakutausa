import React, { useState } from "react";
import { ShoppingCart, Heart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Air Clamp A-100",
    price: 120,
    image: "https://via.placeholder.com/300x200",
    category: "Air Clamp"
  },
  {
    id: 2,
    name: "Horizontal Handle H-200",
    price: 95,
    image: "https://via.placeholder.com/300x200",
    category: "Handle"
  },
  {
    id: 3,
    name: "Quick Release Clamp Q-50",
    price: 150,
    image: "https://via.placeholder.com/300x200",
    category: "Quick Release"
  },
  {
    id: 4,
    name: "Vertical Handle V-300",
    price: 200,
    image: "https://via.placeholder.com/300x200",
    category: "Handle"
  }
];

const categories = ["All", "Air Clamp", "Handle", "Quick Release"];

const ProductPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
        <p className="text-gray-500">
          Select category to explore our products
        </p>
      </div>

      {/* Category Select */}
      <div className="flex justify-end mb-8">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              {/* <p className="text-red-600 font-bold mt-2">${product.price}</p> */}

              {/* <div className="mt-4 flex items-center justify-between">
                <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </button>
                <button className="p-2 border rounded-full hover:bg-gray-100">
                  <Heart className="w-5 h-5 text-gray-500" />
                </button>
              </div> */}
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

export default ProductPage;
