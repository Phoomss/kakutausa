import React, { useState } from "react";
<<<<<<< HEAD
import { ShoppingCart, Heart } from "lucide-react";

// ✅ แก้ชื่อให้ถูกต้อง
import product1 from "/products/HH150-2S.jpg";
import product2 from "/products/HH150.jpg";

=======
import { useNavigate } from "react-router";
import product1 from "/products/HH150-2S.jpg";
import product2 from "/products/HH150.jpg";
import product3 from "/products/FA200.jpg";
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
const products = [
  {
    id: 1,
    name: "Air Clamp A-100",
<<<<<<< HEAD
    price: 120,
=======
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
    image: "https://via.placeholder.com/300x200",
    category: "Air Clamp"
  },
  {
    id: 2,
    name: "HH 150",
<<<<<<< HEAD
    price: 95,
    image: product2, // ✅ ใช้ตัวแปร ไม่ใช่ string
=======
    image: product2,
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
    category: "Horizontal Handle"
  },
  {
    id: 3,
    name: "Quick Release Clamp Q-50",
<<<<<<< HEAD
    price: 150,
=======
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
    image: "https://via.placeholder.com/300x200",
    category: "Quick Release"
  },
  {
    id: 4,
    name: "HH 150-2S",
<<<<<<< HEAD
    price: 200,
    image: product1, // ✅ ใช้ product1 ที่ import มา
    category: "Horizontal Handle"
=======
    image: product1,
    category: "Horizontal Handle"
  },
  {
    id: 5,
    name: "FA 200",
    image: product3,
    category: "Latch Type"
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
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
<<<<<<< HEAD
=======
  const navigate = useNavigate(); // ✅ ใช้ useNavigate
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

<<<<<<< HEAD
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
        <p className="text-gray-500">
          Select category to explore our products
=======
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
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
        </p>
      </div>

      {/* Category Select */}
<<<<<<< HEAD
      <div className="flex justify-end mb-8">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
=======
      <div className="flex justify-start mb-10">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="select select-bordered w-full max-w-xs"
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
<<<<<<< HEAD
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition"
=======
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => handleOnClick(product)}
            className="cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-transform relative"
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
          >
            <img
              src={product.image}
              alt={product.name}
<<<<<<< HEAD
              className="w-full h-48 object-cover"
            />
            <div className="p-4 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              {/* <p className="text-red-600 font-bold mt-2">${product.price}</p> */}
=======
              className="w-full h-52 object-cover"
            />

            {/* Product Info */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-800 truncate">
                {product.name}
              </h3>
>>>>>>> ba03df272fd3802adc37f8d62e22632e3de0a2ed
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
