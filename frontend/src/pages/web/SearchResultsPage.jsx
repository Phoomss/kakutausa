import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import { API_IMAGE_URL } from '../../configs/constants';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        const allProducts = response.data.data;
        
        const filtered = allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.details?.toLowerCase().includes(query.toLowerCase()) ||
          product.description?.toLowerCase().includes(query.toLowerCase()) ||
          product.category?.name?.toLowerCase().includes(query.toLowerCase())
        );

        setProducts(filtered);
        setError(null);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Search Results for: "{query}"
      </h1>

      {loading && (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="mt-4 text-gray-600">Searching products...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-gray-600 mb-6">
            Found {products.length} product{products.length !== 1 ? 's' : ''} for "{query}"
          </p>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-2xl flex flex-col group"
                >
                  {/* Image */}
                  <div className="relative w-full h-64 overflow-hidden rounded-t-3xl">
                    <img
                      src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 text-center">
                      {product.name}
                    </h4>

                    <p className="text-sm text-gray-600 mb-4 text-center">
                      Category: {product.category?.name || "N/A"}
                    </p>

                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="mt-auto bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 w-full shadow-md hover:shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                We couldn't find any products matching "{query}"
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsPage;