import CircularProgress from "./components/CircularProgress";
import HorizontalProgress from "./components/HorizontalProgress";
import {
  calculateAQI,
  getAQICategory,
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
} from "./utils/aqiUtils";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

import aqi from "./assets/AQI.svg";
import close from "./assets/close.svg";
import co2 from "./assets/CO2.svg";
import fan_capacity from "./assets/fan_capacity.svg";
import group from "./assets/Group.svg";
import pm2_5 from "./assets/PM2.5.svg";
import power from "./assets/Power.svg";
import pressure from "./assets/Pressure.svg";
import rh from "./assets/RH.svg";
import tick from "./assets/tick.svg";
import valve from "./assets/Valve.svg";
import fan_rpm from "./assets/fan-rpm.svg";
import ffu from "./assets/ahu.png";

import { LineChart } from "@mui/x-charts";
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

const App = () => {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [gradientone, setGradientone] = useState(null);
  const [gradienttwo, setGradienttwo] = useState(null);

  useEffect(() => {
    if (chartRef1.current) {
      const ctx = chartRef1.current.ctx;
      const canvas = ctx.canvas;
      const gradientFill = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradientFill.addColorStop(0, "rgba(24,205,234,1)");
      gradientFill.addColorStop(1, "rgba(172,244,255,1)");
      setGradientone(gradientFill);
    }
    if (chartRef2.current) {
      const ctx = chartRef2.current.ctx;
      const canvas = ctx.canvas;
      const gradientFill = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradientFill.addColorStop(0, "rgba(52,98,236,1)");
      gradientFill.addColorStop(1, "rgba(173,193,255,1)");
      setGradienttwo(gradientFill);
    }
  }, []);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: true,
        data: [11, 32, 45, 32, 34, 52, 41, 12, 10, 5, 2, 45],
        // borderColor: "transparent",
        borderColor: "#077b8d",
        backgroundColor: gradientone || "rgba(24, 205, 234, 0.8)", // Fallback color
        // backgroundColor: "#18cdea",
        tension: 0.3, // Smooth corners
        pointBackgroundColor: "white", // White dots
        pointBorderColor: "#077b8d", // White border for dots
        // pointRadius: 5, // Size of dots
        // pointHoverRadius: 7, // Bigger dots on hover
      },
    ],
  };
  const data2 = {
    labels,
    datasets: [
      {
        fill: true,
        label: true,
        data: [11, 32, 45, 32, 34, 52, 41, 12, 10, 5, 2, 45],
        borderColor: "#1241cc",
        backgroundColor: gradienttwo || "rgba(24, 205, 234, 0.8)", // Fallback color
        tension: 0.3, // Smooth corners
        pointBackgroundColor: "white", // White dots
        pointBorderColor: "#1241cc",
      },
    ],
  };

  const metrics = [
    {
      label: "Temperature",
      value: "29°C",
      icon: group,
    },
    {
      label: "Fan RPM",
      value: "600",
      icon: fan_rpm,
    },
    {
      label: "RH",
      value: "29°C",
      icon: rh,
    },
    {
      label: "Fan % Capacity",
      value: "24%",
      icon: fan_capacity,
    },
    {
      label: "CO2",
      value: "450 ppm",
      icon: co2,
    },
    {
      label: "Power",
      value: "49 W",
      icon: power,
    },
    {
      label: "PM 2.5",
      value: "72",
      icon: pm2_5,
    },

    {
      label: "Pressure (DP)",
      value: "200",
      icon: pressure,
    },
    {
      label: "AQI",
      value: "200",
      icon: aqi,
    },
    {
      label: "Valve",
      value: "38%",
      icon: valve,
    },
  ];

  return (
    <div className="w-full bg-[#f2f2f6]">
      <div className="max-w-[1440px] mx-auto px-5 py-5 gap-5 grid grid-cols-1 md:grid-cols-2 min-h-screen overflow-hidden ">
        <div className=" grid grid-cols-1 grid-rows-8 gap-[10px] ">
          <div className="row-span-1">
            <img src="/logo.png" className="w-[175px] aspect-auto" alt="logo" />
          </div>
          <div
            className="row-span-3 flex justify-between py-[16px] px-[20px] rounded-xl border-2 border-white bg-white"
            style={{
              boxShadow: "0px 4px 2px 0px rgba(129, 168, 247, 0.4)",
            }}
          >
            <img
              src={ffu}
              alt=""
              className="h-[200px] w-auto object-contain mx-auto drop-shadow-2xl"
            />
          </div>
          <div
            className="flex justify-between py-[16px] row-span-1 px-[20px] rounded-xl border-2 border-white cus-background
              "
          >
            <div className="text-[#888888] text-[13px] font-m">
              Fan Speed (%)
            </div>
          </div>
          <div
            className="row-span-3
            flex flex-col gap-5 py-[16px] px-[20px] rounded-xl border-2 border-white cus-background
            "
          >
            <div className="text-[#888888] text-[13px] font-m">
              Power (Watts)
            </div>
            {/* <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  area: true,
                },
              ]}
              className="w-full"
              height={175}
            /> */}
            <div className="h-[170px] w-full">
              <Line ref={chartRef1} options={options} data={data} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-8 gap-[10px]">
          {metrics.map((e) => {
            return (
              <div
                className="flex justify-between row-span-1 px-[20px] py-[16px] sm:py-[0px]  items-center  rounded-xl border-2 border-white cus-background
                
              "
              >
                <div className="flex flex-col justify-between gap-3">
                  <div className="text-[#888888] text-[13px] font-m">
                    {e.label}
                  </div>
                  <div className="text-[#0cb8d3] text-[20px] font-sb leading-[15px]">
                    {e.value}
                  </div>
                </div>
                <img
                  src={e.icon}
                  alt="icon"
                  className="h-[35px] w-auto aspect-auto"
                />
              </div>
            );
          })}
          <div
            className="row-span-3 cols-span-1 sm:col-span-2
            flex flex-col py-[16px] px-[20px] gap-5 rounded-xl border-2 border-white cus-background
            "
          >
            <div className="text-[#888888] text-[13px] font-m">
              Temperature (°C)
            </div>
            {/* <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  area: true,
                },
              ]}
              className="w-full"
              height={175}
            /> */}
            <div className="h-[170px] w-auto">
              <Line ref={chartRef2} options={options} data={data2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
