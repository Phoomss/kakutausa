import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import productService from "../../services/productService";
import categoryService from "../../services/categoryService";
import { API_IMAGE_URL } from "../../configs/constants";

const ProductsByCategory = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getAllProducts(),
          categoryService.getAllCategories(),
        ]);

        const productsData = prodRes.data.data || [];
        const categoriesData = [
          "All",
          ...(catRes.data.data?.map((c) => c.name) || []),
        ];

        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        console.error("Failed to load products or categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12">
            Our <span className="text-red-600">Products by Category</span>
          </h2>
          <p className="text-gray-700">Loading products...</p>
        </div>
      </section>
    );
  }

  // Filter products by selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-12 text-center">
          Our <span className="text-red-600">Products by Category</span>
        </h2>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? "bg-red-600 text-white"
                  : "bg-red-50 text-red-600 hover:bg-red-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-red-50 rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col"
              >
                <img
                  src={`${API_IMAGE_URL}${product.images[0].imageUrl}`}
                  alt={product.name}
                  className="w-full h-48 object-cover border-b-2 border-red-100"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2 text-center">
                    {product.name}
                  </h4>
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
          <p className="text-center text-gray-700">
            No products found in this category.
          </p>
        )}
      </div>
    </section>
  );
};

export default ProductsByCategory;
