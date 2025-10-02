import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import productService from '../../services/productService';
import { API_IMAGE_URL } from '../../configs/constants';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // For now, fetch all products and filter on frontend
        // In the future, this could be enhanced to have a backend search API
        const response = await productService.getAllProducts();
        const allProducts = response.data.data;

        // Filter products based on query in name, details, description or category
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
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="relative">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={`${API_IMAGE_URL}${product.images[0].imageUrl}`}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-800 truncate">{product.name}</h3>
                    <p className="text-gray-600 text-sm mt-1 truncate">
                      {product.category?.name || 'Uncategorized'}
                    </p>
                    <p className="text-gray-700 text-sm mt-2 line-clamp-2">
                      {product.description}
                    </p>
                    <button 
                      onClick={() => window.location.href = `/products/${product.id}`}
                      className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
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