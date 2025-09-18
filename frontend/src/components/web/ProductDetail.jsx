import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import productService from "../../services/productService";
import { API_IMAGE_URL } from "../../configs/constants";
import sendEmailService from "../../services/sendEmailService";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [unit, setUnit] = useState("inch");
  const [view, setView] = useState("image");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerFirstName, setCustomerFirstName] = useState("");
  const [customerLastName, setCustomerLasttName] = useState("")
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleRequest3D = async () => {
    if (!customerEmail) return;

    setSending(true);
    try {
      await sendEmailService.request3DFile({
        productId: product.id,
        productName: product.name,
        email: customerEmail,
        firstName: customerFirstName,
        lastName: customerLastName,
        message: message,
      });
      alert("Request sent successfully!");
      setShowModal(false);
      setCustomerEmail("");
      setCustomerFirstName("");
      setCustomerLasttName("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setSending(false);
    }
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
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-red-500 mb-4"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      {/* Product Info */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
        <p className="text-gray-600">{product.description}</p>
        <p className="text-sm text-gray-400">
          Category: {product.category?.name || product.category}
        </p>
      </div>

      {/* Image / 3D Toggle */}
      <div className="flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${view === "image"
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-600"
            }`}
          onClick={() => setView("image")}
        >
          Images
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${view === "3d"
            ? "bg-red-500 text-white"
            : "bg-gray-200 text-gray-600"
            }`}
          onClick={() => navigate(`/products/${product.id}/generatemodel`)}
        >
          3D Model
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          <Mail className="w-4 h-4" /> Request 3D File
        </button>
      </div>

      {/* Images Display */}
      {view === "image" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.images && product.images.length > 0 ? (
            product.images.slice(0, 2).map((img, index) => (
              <img
                key={index}
                src={`${API_IMAGE_URL}${img.imageUrl}`}
                alt={`${product.name} ${index + 1}`}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-md"
              />
            ))
          ) : (
            <div className="w-full h-64 md:h-80 bg-gray-200 flex items-center justify-center rounded-lg">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
      )}

      {/* Unit Toggle */}
      <div className="flex space-x-4">
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
                  {unit === "inch"
                    ? size.holdingCapacityInch
                    : size.holdingCapacityMetric}
                </div>
                <div>
                  Weight:{" "}
                  {unit === "inch" ? size.weightInch : size.weightMetric}
                </div>
                {(size.handleMovesInch || size.handleMovesMetric) && (
                  <div>
                    Handle Moves:{" "}
                    {unit === "inch"
                      ? size.handleMovesInch
                      : size.handleMovesMetric}
                  </div>
                )}
                {(size.barMovesInch || size.barMovesMetric) && (
                  <div>
                    Bar Moves:{" "}
                    {unit === "inch" ? size.barMovesInch : size.barMovesMetric}
                  </div>
                )}
                <div>
                  Drawing Movement:{" "}
                  {unit === "inch"
                    ? size.drawingMovementInch
                    : size.drawingMovementMetric}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No specifications available</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Request 3D File</h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="First Name"
                value={customerFirstName}
                onChange={(e) => setCustomerFirstName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={customerLastName}
                onChange={(e) => setCustomerLasttName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <input
              type="email"
              placeholder="Your email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />
            <textarea
              placeholder="Message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest3D}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {sending ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
