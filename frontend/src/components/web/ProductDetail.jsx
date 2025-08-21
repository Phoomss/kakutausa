import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// ตัวอย่างข้อมูล (จริง ๆ ควร fetch จาก API / DB)
const products = [
  {
    id: 2,
    name: "HH 150",
    description:
      "Ideal for lightweight materials and light work production or assembly operations. Supplied with nylon spindle but stainless steel models supplied with stainless steel spindle.",
    image: "/products/HH150.jpg",
    category: "Horizontal Handle",
    specs: {
      inch: {
        HoldingCapacity: "60 lbs",
        Weight: "0.06 lbs",
        HandleMoves: "70°",
        BarMoves: "90°",
      },
      metric: {
        HoldingCapacity: "267 N",
        Weight: "0.027 kg",
        HandleMoves: "70°",
        BarMoves: "90°",
      },
    },
  },
  {
    id: 5,
    name: "FA 200",
    description:
      "The most popular Latch Type clamp is supplied with latch plate. Dipped red vinyl handle grip provided for secure holding purpose. Stainless steel model also available.",
    image: "/products/FA200.jpg",
    category: "Latch Type Clamp",
    specs: {
      inch: {
        HoldingCapacity: "450 lbs",
        DrawingMovement: "1.5 in",
        Weight: "1.8 lbs",
      },
      metric: {
        HoldingCapacity: "2000 N",
        DrawingMovement: "38 mm",
        Weight: "0.8 kg",
      },
    },
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState("inch"); // เลือกหน่วย

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-5 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-red-500 mb-8"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>
            <p className="text-sm text-gray-400 mb-5">
              Category: {product.category}
            </p>

            {/* Unit Switch */}
            <div className="flex space-x-4 mb-5">
              <button
                className={`px-4 py-2 rounded-lg ${
                  unit === "inch"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setUnit("inch")}
              >
                Inch
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${
                  unit === "metric"
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                onClick={() => setUnit("metric")}
              >
                Metric
              </button>
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Specifications ({unit === "inch" ? "Inch" : "Metric"})
              </h2>
              <ul className="space-y-2 text-gray-600">
                {Object.entries(product.specs[unit]).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
