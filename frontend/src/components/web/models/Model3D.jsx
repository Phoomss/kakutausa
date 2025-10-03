import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RotateCcw, RotateCw, Download, Eye, Grid3X3, Box, Move3D, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from 'react-router';
import productService from "../../../services/productService";
const ModelViewer = React.lazy(() => import("./ModelViewer"));

export default function Model3D() {
  const { productId } = useParams();
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

  // Loader 5 วิ
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const res = await productService.getProductById(productId);
        setProduct(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const rotateModel = (axis, direction) => {
    const step = Math.PI / 6;
    setModelRotation((prev) => ({
      ...prev,
      [axis]: prev[axis] + direction * step,
    }));
  };

  const resetRotation = () => setModelRotation({ x: 0, y: 0, z: 0 });

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const gl = canvasRef.current.gl; // access WebGL context
    if (!gl) return;
    const link = document.createElement("a");
    link.download = "model-screenshot.png";
    link.href = gl.domElement.toDataURL();
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center justify-between">
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
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden mt-6">
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[650px]">
          <Canvas
            ref={canvasRef}
            camera={{ position: [4, 4, 4], fov: 50 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            className="w-full h-full rounded-3xl"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} />

            {loading ? (
              <Html center>
                <div className="bg-white/90 px-8 py-6 rounded-xl shadow-lg flex flex-col items-center gap-4 animate-fadeIn">
                  <p className="text-gray-800 font-medium text-lg">Loading 3D Model...</p>
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

          {/* Controls Overlay */}
          <div className="absolute top-4 left-4 flex flex-col gap-3">
            <div className="flex gap-2">
              {[
                { label: "Grid", icon: Grid3X3, state: showGrid, setter: setShowGrid },
                { label: "Dimensions", icon: Box, state: showDimensions, setter: setShowDimensions },
                { label: "Annotations", icon: Eye, state: showAnnotations, setter: setShowAnnotations },
              ].map(({ label, icon: Icon, state, setter }) => (
                <button
                  key={label}
                  onClick={() => setter(!state)}
                  className={`p-2 rounded-xl shadow-md transition-all duration-300 ${state
                    ? "bg-gradient-to-br from-red-500 to-red-400 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  title={label}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            {/* Download + Reset */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={downloadImage}
                className="p-2 bg-gradient-to-br from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 rounded-xl text-white shadow-lg transition"
                title="Download Screenshot"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => cameraResetFn && cameraResetFn()}
                className="p-2 bg-orange-500 hover:bg-orange-400 rounded-xl text-white shadow-lg transition"
                title="Reset Camera"
              >
                <Move3D size={18} />
              </button>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2">
            {[
              { axis: "y", dir: -1, icon: <RotateCcw size={16} /> },
              { axis: "x", dir: -1, icon: "↑" },
              { axis: "y", dir: 1, icon: <RotateCw size={16} /> },
              { axis: "z", dir: -1, icon: "↺" },
              { axis: "x", dir: 1, icon: "↓" },
              { axis: "z", dir: 1, icon: "↻" },
            ].map(({ axis, dir, icon }, idx) => (
              <button
                key={idx}
                onClick={() => rotateModel(axis, dir)}
                className="p-2 bg-gradient-to-br from-red-500 to-red-400 text-white rounded-xl shadow-md hover:scale-105 transition"
              >
                {icon}
              </button>
            ))}
            <button
              onClick={resetRotation}
              className="p-2 bg-red-600 text-white rounded-xl shadow-lg font-bold hover:scale-105 transition"
            >
              Reset
            </button>
          </div>

          {/* View Modes */}
          <div className="absolute top-4 right-4 grid grid-cols-2 gap-2">
            {["front", "right", "top", "3d"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-300 ${viewMode === mode
                  ? "bg-gradient-to-br from-red-500 to-red-400 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {mode.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
