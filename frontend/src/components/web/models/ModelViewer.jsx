import React, {  useEffect } from "react";
import {  useThree } from "@react-three/fiber";
import {  OrbitControls, useGLTF, Text, Line } from "@react-three/drei";
import ToggleClampModel from "./ToggleClampModel";
import Annotation from "./Annotation";
import DimensionLine from "./DimensionLine";

export default function ModelViewer({ 
  showGrid, 
  showAnnotations, 
  showDimensions, 
  viewMode, 
  modelRotation,
  onCameraReset 
}) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (onCameraReset) {
      onCameraReset(() => {
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);
      });
    }
  }, [camera, onCameraReset]);
  
  useEffect(() => {
    switch(viewMode) {
      case 'front':
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
        break;
      case 'right':
        camera.position.set(5, 0, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'top':
        camera.position.set(0, 5, 0);
        camera.lookAt(0, 0, 0);
        break;
      case '3d':
        camera.position.set(3, 3, 3);
        camera.lookAt(0, 0, 0);
        break;
    }
  }, [viewMode, camera]);
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, 5, -5]} intensity={0.5} />
      
      {/* Grid */}
      {showGrid && (
        <gridHelper args={[10, 20]} position={[0, -2, 0]} />
      )}
      
      {/* Main model */}
      <ToggleClampModel rotation={modelRotation} />
      
      {/* Annotations */}
      {showAnnotations && (
        <>
          <Annotation position={[0.8, 1.5, 0]} text="P=M10" />
          <Annotation position={[0.8, 0.5, 0]} text="D=54" />
          <Annotation position={[-1.2, -0.5, 0]} text="R=60" />
          <Annotation position={[0, -2.2, 0]} text="S=105" />
        </>
      )}
      
      {/* Dimension lines */}
      {showDimensions && (
        <>
          <DimensionLine 
            start={[0.6, 1.8, 0]} 
            end={[0.6, 1.2, 0]} 
            label="P=M10"
            offset={[0.2, 0, 0]}
          />
          <DimensionLine 
            start={[-0.8, -1, 0]} 
            end={[0.8, -1, 0]} 
            label="R=60"
            offset={[0, -0.3, 0]}
          />
        </>
      )}
      
      {/* Coordinate system */}
      <group position={[0, 0, 0]}>
        <Line points={[[0, 0, 0], [1, 0, 0]]} color="red" lineWidth={3} />
        <Line points={[[0, 0, 0], [0, 1, 0]]} color="green" lineWidth={3} />
        <Line points={[[0, 0, 0], [0, 0, 1]]} color="blue" lineWidth={3} />
        <Text position={[1.1, 0, 0]} fontSize={0.1} color="red">X</Text>
        <Text position={[0, 1.1, 0]} fontSize={0.1} color="green">Y</Text>
        <Text position={[0, 0, 1.1]} fontSize={0.1} color="blue">Z</Text>
      </group>
      
      <OrbitControls 
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
      />
    </>
  );
}