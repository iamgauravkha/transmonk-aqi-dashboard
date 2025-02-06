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
  // height: "150px", // Set your desired height (in pixels)
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const App = () => {
  const chartRef = useRef(null);
  const [gradient, setGradient] = useState(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.ctx;
      const gradientFill = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
      gradientFill.addColorStop(0, "rgba(24, 205, 234, 0.5)");
      gradientFill.addColorStop(1, "rgba(24, 205, 234, 0.1)");
      setGradient(gradientFill);
    }
  }, []);

  const data = {
    labels,
    datasets: [
      {
        fill: true,
        label: true,
        data: [11, 32, 45, 32, 34, 52, 41, 12, 10, 5, 2, 45],
        borderColor: "rgba(24, 205, 234, 0.2)",
        backgroundColor: gradient || "rgba(24, 205, 234, 0.2)", // Fallback color
        tension: 0.3, // Smooth corners
      },
    ],
  };

  const metrics = [
    {
      label: "Temperature",
      value: "29°C",
      icon: "",
    },
    {
      label: "RH",
      value: "29°C",
      icon: rh,
    },
    {
      label: "CO2",
      value: "450 ppm",
      icon: co2,
    },
    {
      label: "PM 2.5",
      value: "72",
      icon: pm2_5,
    },
    {
      label: "Fan RPM",
      value: "600",
      icon: "",
    },
    {
      label: "Fan Capacity",
      value: "24%",
      icon: fan_capacity,
    },
    {
      label: "Power",
      value: "49 W",
      icon: power,
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
      label: "AQI",
      value: "200",
      icon: aqi,
    },
  ];

  return (
    <div className="w-full bg-[#f2f2f6]">
      <div className="max-w-[1440px] mx-auto px-5 py-5 gap-5 grid grid-cols-2 min-h-screen overflow-hidden">
        <div className=" grid grid-cols-1 grid-rows-8 gap-4 ">
          <div className="row-span-1">
            <img src="/logo.png" className="w-[175px] aspect-auto" alt="logo" />
          </div>
          <div
            className="row-span-3 flex justify-between py-[16px] px-[20px] rounded-xl border-2 border-white bg-white"
            style={{
              boxShadow: "0px 4px 2px 0px rgba(129, 168, 247, 0.4)",
            }}
          ></div>
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
            <div className="text-[#888888] text-[13px] font-m">Power</div>
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
              <Line ref={chartRef} options={options} data={data} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 grid-rows-8 gap-5">
          {metrics.map((e) => {
            return (
              <div
                className="flex justify-between row-span-1 p-[10px]  rounded-xl border-2 border-white cus-background
                
              "
              >
                <div className="flex flex-col justify-between">
                  <div className="text-[#888888] text-sm font-m">{e.label}</div>
                  <div className="text-[#0cb8d3] text-base font-sb">
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
            className="row-span-3 col-span-2
            flex flex-col py-[16px] px-[20px] gap-5 rounded-xl border-2 border-white cus-background
            "
          >
            <div className="text-[#888888] text-[13px] font-m">Temperature</div>
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
              <Line ref={chartRef} options={options} data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
