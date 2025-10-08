import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Mail, X, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [customerLastName, setCustomerLastName] = useState("");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  // Image slider state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

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
      setCustomerLastName("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const nextImage = () => {
    if (!product?.images) return;
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    if (!product?.images) return;
    setCurrentIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
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

  const images = product.images || [];

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
          className={`px-4 py-2 rounded-lg ${
            view === "image"
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setView("image")}
        >
          Images
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            view === "3d"
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

      {/* Image Slider */}
      {view === "image" && images.length > 0 && (
        <div className="relative flex flex-col items-center">
          <img
            src={`${API_IMAGE_URL}${images[currentIndex].imageUrl}`}
            alt={`Image ${currentIndex + 1}`}
            className="w-full max-h-[500px] object-contain rounded-lg shadow-md cursor-pointer"
            onClick={() => setShowPopup(true)}
          />

          {/* Controls */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Image Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div className="relative max-w-5xl w-full px-4">
            <img
              src={`${API_IMAGE_URL}${images[currentIndex].imageUrl}`}
              alt="Zoomed"
              className="w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Close button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>

            {/* Prev / Next buttons */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/70 p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>
      )}

      {/* Unit Toggle */}
      <div className="flex space-x-4">
        {["inch", "metric"].map((u) => (
          <button
            key={u}
            className={`px-4 py-2 rounded-lg ${
              unit === u
                ? "bg-red-500 text-white"
                : "bg-gray-200 text-gray-600"
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
                    {unit === "inch"
                      ? size.barMovesInch
                      : size.barMovesMetric}
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

      {/* Request 3D Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500/40 flex items-center justify-center z-50">
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
                onChange={(e) => setCustomerLastName(e.target.value)}
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
