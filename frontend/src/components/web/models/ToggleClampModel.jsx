import React, { useRef, useEffect } from "react";
import { Html, useGLTF  } from "@react-three/drei";
import * as THREE from "three";

export default function ToggleClampModel({ rotation }) {
  const meshRef = useRef();
  
  // Load the actual GLTF model
  const { scene, nodes, materials } = useGLTF("/models/FA200.gltf"); 
  
  useEffect(() => {
    if (scene) {
      console.log("✅ Unnamed1-FA200.gltf loaded successfully!");
      console.log("Scene:", scene);
      console.log("Nodes:", nodes ? Object.keys(nodes) : "No nodes");
      console.log("Materials:", materials ? Object.keys(materials) : "No materials");
      
      // Calculate model dimensions
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      console.log("Model dimensions:", {
        width: size.x.toFixed(2),
        height: size.y.toFixed(2),
        depth: size.z.toFixed(2)
      });
      
      // Center the model
      scene.position.copy(center.multiplyScalar(-1));
      
      // Auto-scale based on size
      const maxDimension = Math.max(size.x, size.y, size.z);
      if (maxDimension > 3) {
        const newScale = 2 / maxDimension;
        scene.scale.setScalar(newScale);
        console.log(`Model scaled to: ${newScale.toFixed(3)}`);
      } else if (maxDimension < 0.5) {
        const newScale = 2 / maxDimension;
        scene.scale.setScalar(newScale);
        console.log(`Model scaled up to: ${newScale.toFixed(3)}`);
      }
      
      // Enable shadows and optimize materials
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance material properties for better visibility
          if (child.material) {
            if (child.material.color) {
              // Ensure materials aren't too dark
              const hsl = {};
              child.material.color.getHSL(hsl);
              if (hsl.l < 0.2) {
                child.material.color.setHSL(hsl.h, hsl.s, 0.4);
              }
            }
            child.material.metalness = child.material.metalness || 0.3;
            child.material.roughness = child.material.roughness || 0.4;
          }
        }
      });
    }
  }, [scene, nodes, materials]);
  
  useEffect(() => {
    if (meshRef.current && rotation) {
      meshRef.current.rotation.x = rotation.x;
      meshRef.current.rotation.y = rotation.y;
      meshRef.current.rotation.z = rotation.z;
    }
  }, [rotation]);
  
  if (!scene) {
    return (
      <Html center>
        <div style={{
          color: 'white', 
          background: 'rgba(0,0,0,0.8)', 
          padding: '15px 20px', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{fontSize: '16px', marginBottom: '5px'}}>
            🔄 Loading Unnamed1-FA200.gltf
          </div>
          <div style={{fontSize: '12px', opacity: 0.7}}>
            Please wait...
          </div>
        </div>
      </Html>
    );
  }
  
  return (
    <group ref={meshRef}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}