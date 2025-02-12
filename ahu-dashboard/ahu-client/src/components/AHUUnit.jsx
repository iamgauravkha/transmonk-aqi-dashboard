import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function FanModel() {
  const { scene } = useGLTF("/fan_3d_model.glb");
  return <primitive object={scene} scale={10} position={[10, -7, -40]} />;
}

export default function AHUUnit() {
  return (
    <Canvas
      camera={{ position: [50, 50, 100], fov: 40 }}
      className=" bg-gray-300"
    >
      <ambientLight intensity={1} />
      <directionalLight position={[15, 10, 15]} />
      <FanModel />
      <OrbitControls enableZoom enableRotate enablePan />
    </Canvas>
  );
}
