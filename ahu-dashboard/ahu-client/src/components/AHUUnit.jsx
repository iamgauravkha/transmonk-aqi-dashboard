import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Bounds, useTexture } from "@react-three/drei";

function FanModel() {
  const { scene } = useGLTF("/fan_3d_model.glb"); // Update path

  const texture = useTexture("/fan_texture.jpeg");

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.map = texture;
      child.material.needsUpdate = true;
    }
  });
  
  return <primitive object={scene} scale={0.1} />;
}

export default function AHUUnit() {
  return (
    <Canvas camera={{ position: [50, 50, 100], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} />
      {/* <Bounds fit clip observe margin={1.2}> */}
      <FanModel />
      {/* </Bounds> */}
      <OrbitControls enableZoom enableRotate enablePan />
    </Canvas>
  );
}
