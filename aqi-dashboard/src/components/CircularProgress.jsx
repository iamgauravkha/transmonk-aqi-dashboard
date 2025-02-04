import React from "react";
import { motion } from "framer-motion";

const CircularProgress = ({ value, max = 100, heading, unit }) => {
  const radius = 25; // Radius of the circle
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const progress = (value / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-xl w-full aspect-square">
      <svg width="80" height="80" viewBox="0 0 60 60">
        {/* Background Circle */}
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated Progress Circle */}
        <motion.circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#EC5C3F"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 30 30)"
          animate={{
            strokeDashoffset: circumference - progress, // Animate stroke offset
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }} // Smooth transition
        />
        {/* Value Text */}
        <motion.text
          x="30"
          y="30"
          textAnchor="middle"
          dy="0.35em"
          fontSize="10"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <tspan x="30" dy="-2" fontSize="9" fill="black">
            {value == 0 ? "NA" : value}
          </tspan>
          <tspan x="30" dy="12" fill="#EC5C3F" fontSize="7">
            {unit}
          </tspan>
        </motion.text>
      </svg>
      <p className="text-xs font-medium text-gray-600 mt-2">{heading}</p>
    </div>
  );
};

export default CircularProgress;
