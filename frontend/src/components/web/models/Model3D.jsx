import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RotateCcw, RotateCw, Download, Eye, Grid3X3, Box, Move3D, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from 'react-router';
import productService from "../../../services/productService";
const ModelViewer = React.lazy(() => import("./ModelViewer"));

export default function Model3D() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [viewMode, setViewMode] = useState("3d");
  const [modelRotation, setModelRotation] = useState({ x: 0, y: 0, z: 0 });
  const [cameraResetFn, setCameraResetFn] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef();
  const navigate = useNavigate();

  // Loader 2 วิ
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await productService.getProductById(id);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const rotateModel = (axis, direction) => {
    const step = Math.PI / 6;
    setModelRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + direction * step,
    }));
  };

  const resetRotation = () => setModelRotation({ x: 0, y: 0, z: 0 });

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = "model-screenshot.png";
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between bg-white rounded-xl shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-500 transition"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center flex-1">
          <h1 className="text-red-600 text-lg sm:text-2xl font-extrabold">
            {loadingProduct ? "Loading..." : product?.name || "Unknown Product"}
          </h1>
        </div>
      </div>

      {/* 3D Viewer Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mt-6">
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[650px]">
          <Canvas
            ref={canvasRef}
            camera={{ position: [4, 4, 4], fov: 50 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} />

            {loading ? (
              <Html center>
                <div className="bg-white px-6 py-4 rounded-xl shadow-md flex flex-col items-center gap-4">
                  <p className="text-gray-700 font-medium text-lg">Loading 3D Model...</p>
                  <div className="flex gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-3 h-3 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </Html>
            ) : (
              <Suspense fallback={null}>
                <ModelViewer
                  productId={product?.id}
                  showGrid={showGrid}
                  showAnnotations={showAnnotations}
                  showDimensions={showDimensions}
                  viewMode={viewMode}
                  modelRotation={modelRotation}
                  onCameraReset={setCameraResetFn}
                />
              </Suspense>
            )}
          </Canvas>

          {/* Left Controls */}
          <div className="absolute top-4 left-4 flex flex-col gap-3">
            {[{ label: "Grid", icon: Grid3X3, state: showGrid, setter: setShowGrid },
              { label: "Dimensions", icon: Box, state: showDimensions, setter: setShowDimensions },
              { label: "Annotations", icon: Eye, state: showAnnotations, setter: setShowAnnotations }].map(({ label, icon: Icon, state, setter }) => (
              <button
                key={label}
                onClick={() => setter(!state)}
                className={`p-3 rounded-xl border transition-all duration-300 ${state ? "bg-gradient-to-br from-red-500 to-orange-500 text-white border-red-400 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-red-300"}`}
                title={label}
              >
                <Icon size={20} />
              </button>
            ))}

            {/* Download + Reset */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={downloadImage}
                className="p-3 bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl text-white shadow-md transition"
                title="Download Screenshot"
              >
                <Download size={20} />
              </button>
              <button
                onClick={() => cameraResetFn && cameraResetFn()}
                className="p-3 bg-gradient-to-br from-orange-400 to-yellow-500 hover:from-orange-500 hover:to-yellow-600 rounded-xl text-white shadow-md transition"
                title="Reset Camera"
              >
                <Move3D size={20} />
              </button>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <button
              onClick={() => rotateModel("x", -1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
            >
              ↑
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => rotateModel("y", -1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
              >
                ←
              </button>
              <button
                onClick={resetRotation}
                className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md shadow hover:scale-105 transition"
              >
                ⟳
              </button>
              <button
                onClick={() => rotateModel("y", 1)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
              >
                →
              </button>
            </div>
            <button
              onClick={() => rotateModel("x", 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow hover:bg-gray-100 transition"
            >
              ↓
            </button>
          </div>

          {/* View Modes */}
          <div className="absolute top-4 right-4 bg-white border border-gray-200 rounded-2xl p-2 shadow-md">
            <div className="grid grid-cols-3 gap-2">
              {["front", "back", "left", "right", "top", "bottom", "3d"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 ${viewMode === mode ? "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-md" : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
                >
                  {mode.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
