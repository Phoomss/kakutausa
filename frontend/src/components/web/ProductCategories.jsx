import React from "react";


const categories = [
  {
    name: "Horizontal Handle",
    image: "/images/horizontal-handle.jpg",
  },
  {
    name: "Latch Type",
    image: "/images/latch-type.jpg",
  },
  {
    name: "Special Hold Down",
    image: "/images/special-hold-down.jpg",
  },
  {
    name: "Squeeze Action",
    image: "/images/squeeze-action.jpg",
  },
  {
    name: "Straight Line Action",
    image: "/images/straight-line.jpg",
  },
  {
    name: "Vertical Handle",
    image: "/images/vertical-handle.jpg",
  },
  {
    name: "Custom Solutions",
    image: "/images/custom.jpg",
  },
];

const ProductCategories = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Product <span className="text-red-600">Categories</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, index) => (
            <div
              key={index}
              className="bg-red-50 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer p-4 flex flex-col items-center"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-32 h-32 object-cover mb-4 rounded-lg border-2 border-red-100"
              />
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                {cat.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
