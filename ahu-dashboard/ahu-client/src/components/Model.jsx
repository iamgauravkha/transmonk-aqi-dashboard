import React, { useEffect, useRef, useState } from "react";

const Model = ({ modelPath }) => {
  const modelRef = useRef();
  const [animationName, setAnimationName] = useState("");
  const [availableAnimations, setAvailableAnimations] = useState([]);

  useEffect(() => {
    // Load animations when model is ready
    if (modelRef.current) {
      modelRef.current.addEventListener("load", () => {
        const animations = modelRef.current.availableAnimations;
        setAvailableAnimations(animations);
        if (animations.length > 0) {
          setAnimationName(animations[0]);
        }
        console.log("Available animations:", animations);
      });
    }
  }, []);

  // Update animation speed
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.timeScale = 0.5;
    }
  }, []);

  return (
    <div className="model-viewer-container">
      <model-viewer
        ref={modelRef}
        src={modelPath}
        alt="3D model with particle animation"
        camera-controls
        auto-rotate
        ar
        shadow-intensity="1"
        animation-name={animationName}
        autoplay
        loop
        interpolation-decay="200"
        style={{
          width: "100%",
          height: "230px",
          backgroundColor: "#f5f5f5",
          margin: "9px auto",
        }}
        camera-orbit="90deg 75deg auto" // Rotates model to 135° on X-axis
        field-of-view="50deg" // Adjust to make model look bigger
      />
    </div>
  );
};

export default Model;
