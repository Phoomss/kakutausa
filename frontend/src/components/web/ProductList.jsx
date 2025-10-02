import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import productService from "../../services/productService";
import { API_IMAGE_URL } from "../../configs/constants";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getAllProducts();
        // Show only first 8 products
        setProducts(res.data.data.slice(0, 8) || []);
      } catch (err) {
        console.error("Failed to load products", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12">
            Our <span className="text-red-600">Products</span>
          </h2>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Our <span className="text-red-600">Products</span>
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-red-50 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col"
              >
                <img
                  src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
                  alt={product.name}
                  className="w-full h-48 object-cover border-b-2 border-red-100"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 text-center">
                    Category: {product.category?.name || "N/A"}
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
        ) : (
          <p className="text-center text-gray-700">No products available at the moment.</p>
        )}
      </div>
    </section>
  );
};

export default ProductList;
