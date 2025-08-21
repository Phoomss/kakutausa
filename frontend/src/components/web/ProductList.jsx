import React from "react";
import { useNavigate } from "react-router-dom";

const products = [
  { id: 1, name: "Air Clamp A-100", image: "https://via.placeholder.com/300x200", category: "Air Clamp" },
  { id: 2, name: "HH 150", image: "https://via.placeholder.com/300x200", category: "Horizontal Handle" },
  { id: 3, name: "Quick Release Clamp Q-50", image: "https://via.placeholder.com/300x200", category: "Quick Release" },
  { id: 4, name: "HH 150-2S", image: "https://via.placeholder.com/300x200", category: "Horizontal Handle" },
  { id: 5, name: "FA 200", image: "/products/FA200.webp", category: "Latch Type" },
];

const ProductList = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Our <span className="text-red-600">Products</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-red-50 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover border-b-2 border-red-100"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 text-center">
                  Category: {product.category}
                </p>
                <button
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-800 transition w-full"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductList;
