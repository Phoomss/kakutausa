import React from "react";

const categories = [
  {
    name: "Toggle Clamps",
    products: [
      { name: "Toggle Clamp A", image: "/images/product1.jpg", price: "$25.00" },
      { name: "Toggle Clamp B", image: "/images/product2.jpg", price: "$30.00" },
    ],
  },
  {
    name: "Air Clamps",
    products: [
      { name: "Air Clamp A", image: "/images/product3.jpg", price: "$35.00" },
      { name: "Air Clamp B", image: "/images/product4.jpg", price: "$40.00" },
    ],
  },
  {
    name: "Handles",
    products: [
      { name: "Handle A", image: "/images/product5.jpg", price: "$15.00" },
      { name: "Handle B", image: "/images/product6.jpg", price: "$20.00" },
    ],
  },
];

const ProductsByCategory = () => {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Our <span className="text-red-600">Products by Category</span>
        </h2>

        {categories.map((cat, idx) => (
          <div key={idx} className="mb-16">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">{cat.name}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {cat.products.map((product, index) => (
                <div
                  key={index}
                  className="bg-red-50 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover border-b-2 border-red-100"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                      {product.name}
                    </h4>
                    <p className="text-red-600 font-bold mb-4 text-center">{product.price}</p>
                    <button className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition w-full">
                      Buy Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductsByCategory;
