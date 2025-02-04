import React from "react";
import { motion } from "framer-motion";

const HorizontalProgress = ({ value, max = 100, heading, unit }) => {
  return (
    <div className="flex flex-col bg-white shadow-xl p-3 rounded-xl w-full">
      {/* Percentage Value */}
      <p className="text-md font-semibold flex gap-1 items-center">
        {value == 0 ? "NA" : Math.round(value)}
        <span className="text-sm">{unit}</span>
      </p>
      {/* Label */}
      <p className="text-sm font-medium text-gray-600">{heading}</p>
      {/* Progress Bar */}
      <div className="w-full bg-gray-300 h-2.5 rounded-full mt-2 overflow-hidden">
        <motion.div
          className="h-full bg-orange-500 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default HorizontalProgress;
