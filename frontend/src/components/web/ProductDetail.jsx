import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import productService from "../../services/productService";
import { API_IMAGE_URL } from "../../configs/constants";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [unit, setUnit] = useState("inch");
  const [view, setView] = useState("image");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data.data); // สมมติ API response เป็น { data: {...} }
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleClick3D = () => {
    navigate(`/products/${id}/generatemodel`);
  };

  if (loading) return <p className="text-center py-10">Loading product...</p>;
  if (error || !product)
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
        {/* Image / 3D Viewer */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          {/* Toggle Buttons */}
          <div className="flex justify-center space-x-4 p-3 bg-gray-100">
            <button
              className={`px-4 py-2 rounded-lg ${view === "image"
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-600"
                }`}
              onClick={() => setView("image")}
            >
              Image
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300"
              onClick={handleClick3D}
            >
              3D Model
            </button>
          </div>

          {view === "image" && (
            <img
              src={`${API_IMAGE_URL}${product.images[0]?.imageUrl || ""}`}
              alt={product.name}
              className="w-full h-[400px] object-cover"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            <p className="text-sm text-gray-400 mb-5">
              Category: {product.category?.name || product.category}
            </p>

            {/* Unit Switch */}
            <div className="flex space-x-4 mb-5">
              {["inch", "metric"].map((u) => (
                <button
                  key={u}
                  className={`px-4 py-2 rounded-lg ${unit === u ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
                    }`}
                  onClick={() => setUnit(u)}
                >
                  {u.charAt(0).toUpperCase() + u.slice(1)}
                </button>
              ))}
            </div>

            {/* Specifications */}
            <div className="bg-gray-50 p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Specifications ({unit === "inch" ? "Inch" : "Metric"})
              </h2>

              {product.sizes && product.sizes.length > 0 ? (
                <ul className="space-y-2 text-gray-600">
                  {product.sizes.map((size) => (
                    <li key={size.id} className="border-b border-gray-200 pb-2">
                      <div>
                        Holding Capacity:{" "}
                        {unit === "inch" ? size.holdingCapacityInch : size.holdingCapacityMetric}
                      </div>
                      <div>
                        Weight: {unit === "inch" ? size.weightInch : size.weightMetric}
                      </div>
                      {(size.handleMovesInch || size.handleMovesMetric) && (
                        <div>
                          Handle Moves: {unit === "inch" ? size.handleMovesInch : size.handleMovesMetric}
                        </div>
                      )}
                      {(size.barMovesInch || size.barMovesMetric) && (
                        <div>
                          Bar Moves: {unit === "inch" ? size.barMovesInch : size.barMovesMetric}
                        </div>
                      )}
                      <div>
                        Drawing Movement:{" "}
                        {unit === "inch" ? size.drawingMovementInch : size.drawingMovementMetric}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No specifications available</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
