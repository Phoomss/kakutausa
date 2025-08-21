import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { RotateCcw, RotateCw, Download, Eye, Grid3X3, Box, Move3D, ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router';
const ModelViewer = React.lazy(() => import("./ModelViewer"));

export default function Model3D() {
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
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="max-w-5xl mx-auto p-6">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-red-500"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        <div className="text-center flex-1">
          <h1 className="text-red-600 text-lg sm:text-xl font-bold">FA 200</h1>
          <p className="text-gray-700 text-sm sm:text-base">Latch Type Clamp</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
       
        {/* 3D Viewer */}
        <div className="relative w-full h-[500px]">
          <Canvas
            ref={canvasRef}
            camera={{ position: [4, 4, 4], fov: 50 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} />

            {loading ? (
              <Html center>
                <div className="bg-white/80 px-6 py-4 rounded shadow-md flex flex-col items-center gap-3">
                  <p className="text-gray-800 font-medium">Loading 3D Model...</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </Html>
            ) : (
              <Suspense fallback={null}>
                <ModelViewer
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

          {/* Controls (overlay) */}
          <div className="absolute top-4 left-4 flex flex-col gap-3">
            {/* Toggle buttons */}
            <div className="flex gap-2">
              {[
                { label: "Grid", icon: Grid3X3, state: showGrid, setter: setShowGrid },
                { label: "Dimensions", icon: Box, state: showDimensions, setter: setShowDimensions },
                { label: "Annotations", icon: Eye, state: showAnnotations, setter: setShowAnnotations },
              ].map(({ label, icon: Icon, state, setter }) => (
                <button
                  key={label}
                  onClick={() => setter(!state)}
                  className={`p-2 rounded-xl transition-all duration-300 ${state
                    ? "bg-red-500 text-white hover:bg-red-400"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  title={label}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            {/* Download + Reset */}
            <div className="flex gap-2">
              <button
                onClick={downloadImage}
                className="p-2 bg-red-600 hover:bg-red-500 rounded-xl text-white"
                title="Download Screenshot"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => cameraResetFn && cameraResetFn()}
                className="p-2 bg-orange-500 hover:bg-orange-400 rounded-xl text-white"
                title="Reset Camera"
              >
                <Move3D size={18} />
              </button>
            </div>
          </div>

          {/* Rotation Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2">
            <button onClick={() => rotateModel("y", -1)} className="p-2 bg-red-500 rounded-xl text-white"><RotateCcw size={16} /></button>
            <button onClick={() => rotateModel("x", -1)} className="p-2 bg-red-500 rounded-xl text-white">↑</button>
            <button onClick={() => rotateModel("y", 1)} className="p-2 bg-red-500 rounded-xl text-white"><RotateCw size={16} /></button>
            <button onClick={() => rotateModel("z", -1)} className="p-2 bg-red-500 rounded-xl text-white">↺</button>
            <button onClick={() => rotateModel("x", 1)} className="p-2 bg-red-500 rounded-xl text-white">↓</button>
            <button onClick={() => rotateModel("z", 1)} className="p-2 bg-red-500 rounded-xl text-white">↻</button>
            <button onClick={resetRotation} className="p-2 bg-red-600 rounded-xl text-white font-bold">Reset</button>
          </div>

          {/* View Modes */}
          <div className="absolute top-4 right-4 grid grid-cols-2 gap-2">
            {["front", "right", "top", "3d"].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-2 py-1 rounded-lg text-xs transition-all duration-300 ${viewMode === mode
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
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
