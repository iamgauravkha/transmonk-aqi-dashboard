import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function FanModel() {
  const { scene } = useGLTF("/fan_3d_model.glb");
  return (
    <primitive
      object={scene}
      scale={12}
      position={[10, -9, -60]}
      rotation={[0, -0.8 , 0]}
    />
  );
}

export default function AHUUnit() {
  return (
    <Canvas
      camera={{ position: [50, 50, 100], fov: 35 }}
      className=" bg-gray-300"
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      <FanModel />
      <OrbitControls enableZoom enableRotate enablePan />
    </Canvas>
  );
}
