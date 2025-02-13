import React from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useRef, useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // Hide legend
    },
    title: {
      display: false, // Hide title
    },
  },
  scales: {
    x: {
      display: true, // Hide x-axis labels
      grid: {
        display: false, // Remove x-axis grid lines
      },
    },
    y: {
      display: true, // Hide y-axis labels
      grid: {
        display: false, // Remove y-axis grid lines
      },
    },
  },
  maintainAspectRatio: false, // To prevent it from being distorted
  height: 0, // Set your desired height (in pixels)
};

const labels = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM"];

const Graph = ({ data, setGraph, colorOne, colorTwo, labelOne }) => {
  console.log(data);
  const chartRef1 = useRef(null);
  const [gradientone, setGradientone] = useState(null);
  const [selectedReading, setSelectedReading] = useState(labelOne);
  const [menu, setMenu] = useState(false);
  const [graphLabel, setGraphLabel] = useState("PM 2.5");

  const formatData = (data) => {
    return data.hours
      .sort((a, b) => a.hour - b.hour) // Sort hours
      .map((item) => ({
        label: formatHour(item.hour), // Convert to 12-hour format
        ...item, // Keep the rest of the properties
      }));
  };

  const formatHour = (hour) => {
    let period = hour >= 12 ? "PM" : "AM";
    let formattedHour = hour % 12 || 12; // Convert 0 to 12
    return `${formattedHour} ${period}`;
  };

  const formattedData = formatData(data); // Convert and sort

  console.log(formattedData);

  useEffect(() => {
    if (chartRef1.current) {
      const ctx = chartRef1.current.ctx;
      const canvas = ctx.canvas;
      const gradientFill = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradientFill.addColorStop(0, colorOne);
      gradientFill.addColorStop(1, colorTwo);
      setGradientone(gradientFill);
    }
  }, []);

  const graphData = {
    labels: formattedData.map((item) => item.label),
    // labels: [
    //   "12 AM",
    //   "1 AM",
    //   "2 AM",
    //   "3 AM",
    //   "4 AM",
    //   "5 AM",
    //   "6 AM",
    //   "7 AM",
    //   "8 AM",
    //   "9 AM",
    //   "10 AM",
    //   "11 AM",
    //   "12 PM",
    //   "1 PM",
    //   "2 PM",
    //   "3 PM",
    //   "4 PM",
    //   "5 PM",
    //   "6 PM",
    //   "7 PM",
    //   "8 PM",
    //   "9 PM",
    //   "10 PM",
    //   "11 PM",
    // ],
    datasets: [
      {
        fill: true,
        label: selectedReading,
        data: formattedData.map((item) => item[selectedReading]),

        // borderColor: "transparent",
        borderColor: "#077b8d",
        // borderColor: "transparent",
        backgroundColor: gradientone || "rgba(24, 205, 234, 0.8)", // Fallback color
        // backgroundColor: "transparent",
        tension: 0.5, // Smooth corners
        pointBackgroundColor: "white", // White dots
        pointBorderColor: "#077b8d", // White border for dots
        // pointRadius: 5, // Size of dots
        // pointHoverRadius: 7, // Bigger dots on hover
      },
    ],
  };

  const readingChangeHandler = (e, key, label) => {
    e.stopPropagation();
    setSelectedReading(key);
    setGraphLabel(label);
    setMenu(false);
  };

  return <Line ref={chartRef1} options={options} data={graphData} />;
};

export default Graph;
