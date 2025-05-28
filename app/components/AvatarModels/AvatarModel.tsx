import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Group } from "three";

// Define the props type
interface AvatarModelProps {
  visemeIndex: number; // The current viseme index for morph targets
}

const AvatarModel = ({ visemeIndex }: AvatarModelProps) => {
  // GLTF result types (scene is a Group, nodes is an object)
  const { scene, nodes } = useGLTF("/models/WaitressCH.glb") as {
    scene: Group;
    nodes: Record<string, any>;
  };

  // Refs for managing the mesh and morph target influences
  const meshRef = useRef<any>(null); // Ref for the mesh with morph targets
  const targetInfluences = useRef<number[]>([]); // Target influences array
  const currentInfluences = useRef<number[]>([]); // Current influences array

  // Initialize the morph target influences when the model is loaded
  useEffect(() => {
    const mesh = Object.values(nodes).find(
      (node: any) => node.morphTargetInfluences
    );

    if (mesh && mesh.morphTargetInfluences) {
      meshRef.current = mesh;
      const numInfluences = mesh.morphTargetInfluences.length;
      targetInfluences.current = new Array(numInfluences).fill(0);
      currentInfluences.current = new Array(numInfluences).fill(0);
      mesh.morphTargetInfluences = currentInfluences.current;
    }
  }, [nodes]);

  // Update the target influences based on the viseme index
  useEffect(() => {
    if (
      meshRef.current &&
      visemeIndex >= 0 &&
      visemeIndex < targetInfluences.current.length
    ) {
      targetInfluences.current = targetInfluences.current.map(() => 0); // Reset all influences
      targetInfluences.current[visemeIndex] = 1; // Activate the current viseme
    }
  }, [visemeIndex]);

  // Smoothly interpolate morph target influences on each frame
  useFrame((state, delta) => {
    if (meshRef.current && meshRef.current.morphTargetInfluences) {
      const speed = 5; // Adjust this for smoothness vs responsiveness
      for (let i = 0; i < targetInfluences.current.length; i++) {
        currentInfluences.current[i] +=
          (targetInfluences.current[i] - currentInfluences.current[i]) *
          speed *
          delta;
        currentInfluences.current[i] = Math.max(
          0,
          Math.min(1, currentInfluences.current[i])
        );
      }
      meshRef.current.morphTargetInfluences = currentInfluences.current;
    }
  });

  return (
    <primitive
      object={scene}
      scale={[2, 2, 2]}
      position={[0, -106, 0]}
    />
  );
};

export default AvatarModel;
