// import CircularProgress from "./components/CircularProgress";
// import HorizontalProgress from "./components/HorizontalProgress";
// import {
//   calculateAQI,
//   getAQICategory,
//   PM10_BREAKPOINTS,
//   PM25_BREAKPOINTS,
// } from "./utils/aqiUtils";
// import Navbar from "./components/Navbar";
// import Dashboard from "./components/Dashboard";

import { IoSettingsSharp } from "react-icons/io5";

import { IoClose } from "react-icons/io5";

import aqiImg from "../assets/AQI.svg";
import close from "../assets/close.svg";
import co2 from "../assets/CO2.svg";
import fan_capacity from "../assets/fan_capacity.svg";
import group from "../assets/Group.svg";
import pm2_5 from "../assets/PM2.5.svg";
import power from "../assets/Power.svg";
import pressure from "../assets/Pressure.svg";
import rh from "../assets/RH.svg";
import tick from "../assets/tick.svg";
import valveImg from "../assets/Valve.svg";
import fan_rpm from "../assets/fan-rpm.svg";
import ffu from "../assets/ahu.png";
import Toaster from "react-hot-toast";

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
import AHUUnit from "../components/AHUUnit";
import toast from "react-hot-toast";
import Settings from "../pages/Settings";
import { useParams } from "react-router-dom";
import Graph from "../components/Graph";
import {
  calculateAQI,
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
} from "../utils/aqiUtils";

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

const Dashboard = () => {
  const params = useParams();
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const [loading, setLoading] = useState(false);

  const [gradientone, setGradientone] = useState(null);
  const [gradienttwo, setGradienttwo] = useState(null);
  const [speed, setSpeed] = useState();
  const [valve, setValve] = useState();
  const [aqi, setAqi] = useState();
  const [modal, setModal] = useState(false);
  const [settingsUpdated, setSettingsUpdated] = useState(false);

  const [apiData, setApiData] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const clickHandler = async (sValue, vValue) => {
    const loadingCtn = toast.loading("Loading");
    setLoading(true);
    const payload = { type: "command", speedValue: 0, valveValue: 0 };
    if (!sValue) {
      payload.speedValue = 0;
    } else {
      payload.speedValue = sValue;
    }
    if (!vValue) {
      payload.valveValue = 0;
    } else {
      payload.valveValue = vValue;
    }
    const deviceId = localStorage.getItem("id");
    try {
      const response = await fetch(
        `http://localhost:4500/api/v1/update-fan-speed/${deviceId}`,
        {
          method: "POST", // Specify the HTTP method
          headers: {
            "Content-Type": "application/json", // Set the content type if sending JSON
          },
          body: JSON.stringify(payload), // Convert data to JSON string
        }
      );

      const data = await response.json();

      if (!data.success) {
        toast.dismiss(loadingCtn);
        toast.error("Error! Try again");
        throw new Error("Something went wrong");
      } else {
        toast.dismiss(loadingCtn);
        toast.success("Fan Speed Successfully");
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      toast.dismiss(loadingCtn);
      setLoading(false);
    }
  };

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

  useEffect(() => {
    localStorage.setItem("id", params.id);
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
      key: "ambientTemperature",
    },
    {
      label: "Fan RPM",
      value: "600",
      icon: fan_rpm,
      key: "fanRPM",
    },
    {
      label: "RH",
      value: "29°C",
      icon: rh,
      key: "ambientHumidity",
    },
    {
      label: "Fan % Capacity",
      value: "24%",
      icon: fan_capacity,
      key: "setVoltOne",
    },
    {
      label: "CO2",
      value: "450 ppm",
      icon: co2,
      key: "cO2",
    },
    {
      label: "PM 10 (µg/m³)",
      value: "80",
      icon: power,
      key: "pM10",
    },
    {
      label: "PM 2.5 (µg/m³)",
      value: "72",
      icon: pm2_5,
      key: "pM25",
    },

    {
      label: "Pressure (DP)",
      value: "200",
      icon: pressure,
      key: "dP",
    },
    {
      label: "AQI",
      value: "200",
      icon: aqiImg,
      key: "vocIndex",
    },
    {
      label: "Valve",
      value: "38%",
      icon: valveImg,
      key: "setVoltTwo",
    },
  ];

  const getDeviceData = async () => {
    const res = await fetch(
      `http://localhost:4500/api/v1/device-data/${params.id}`
    );
    const data = await res.json();
    console.log(data);
    const aqiPM25 = Math.round(
      calculateAQI(data.apiResponse.pM25 || 0, PM25_BREAKPOINTS)
    );
    const aqiPM10 = Math.round(
      calculateAQI(data.apiResponse.pM10 || 0, PM10_BREAKPOINTS)
    );
    const overallAQI = Math.max(aqiPM25, aqiPM10);
    console.log(overallAQI);
    setAqi(overallAQI);
    setApiData(data.apiResponse);
    setSpeed(data.apiResponse.setVoltOne);
    setValve(data.apiResponse.setVoltTwo);
  };

  console.log("aqi", aqi);

  const getGraphData = async () => {
    const res = await fetch(
      `http://localhost:4500/api/v1/device-graph-data/${params.id}`
    );
    const data = await res.json();
    console.log(data);
    setGraphData(data.apiResponse);
  };

  useEffect(() => {
    getDeviceData();
    getGraphData();
  }, [settingsUpdated]);

  return (
    <div className="w-full bg-[#f2f2f6] relative">
      {modal ? (
        apiData && (
          <Settings
            setModal={setModal}
            apiData={apiData}
            setSettingsUpdated={setSettingsUpdated}
          />
        )
      ) : (
        <div className="max-w-[1440px] mx-auto px-5 py-5 gap-5 grid grid-cols-1 md:grid-cols-2 min-h-screen">
          <div className="grid grid-cols-1 sm:grid-rows-8 gap-[10px] ">
            <div className="sm:row-span-1">
              <img
                src="/logo.png"
                className="w-[175px] aspect-auto"
                alt="logo"
              />
            </div>
            <div
              className="mt-10 sm:mt-0 sm:row-span-3 flex justify-between overflow-hidden rounded-xl border-2 border-white bg-white"
              style={{
                boxShadow: "0px 4px 2px 0px rgba(129, 168, 247, 0.4)",
              }}
            >
              <AHUUnit />
            </div>
            <div
              className="flex justify-start sm:justify-center gap-2 flex-col sm:row-span-1 px-[20px] py-[20px] sm:py-[0px] rounded-xl border-2 border-white cus-background
      "
            >
              <div className="text-[#888888] text-[13px] font-m">
                Fan Speed (%)
              </div>
              <div className="flex text-[12px] gap-2 sm:gap-5 flex-wrap justify-between items-center">
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    className="border rounded-md border-gray-400 text-center w-[100px]"
                    placeholder={speed ?? "NA"}
                    onChange={(e) => setSpeed(e.target.value)}
                  />
                  <button
                    className={`px-[9px] py-[4px] bg-[rgba(12,184,211,0.75)]  hover:bg-[rgba(12,184,211,1)] text-white rounded-md font-sb ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      clickHandler(speed, valve);
                    }}
                  >
                    Change Speed
                  </button>
                  <button
                    className={`px-[9px] py-[4px] bg-red-500 hover:bg-red-600 text-white rounded-md font-sb ${
                      loading
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      clickHandler();
                    }}
                  >
                    Stop
                  </button>
                </div>
                <IoSettingsSharp
                  className="text-2xl text-blue-500 cursor-pointer"
                  onClick={() => {
                    setModal((prev) => !prev);
                  }}
                />
              </div>
            </div>
            <div
              className="sm:row-span-3
    flex flex-col gap-5 py-[16px] px-[20px] rounded-xl border-2 border-white cus-background
    "
            >
              <div className="text-[#888888] text-[13px] font-m">
                CO<sub>2</sub> (ppm)
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
                {graphData && (
                  <Graph
                    data={graphData}
                    colorOne={"rgba(24,205,234,1)"}
                    colorTwo={"rgba(172,244,255,1)"}
                    labelOne={"cO2"}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 grid-rows-8 gap-[10px] ">
            {metrics.map((e, i) => {
              return (
                <div
                  className="flex justify-between row-span-1 px-[20px] py-[16px] sm:py-[0px]  items-center  rounded-xl border-2 border-white cus-background
        
      "
                  key={i}
                >
                  <div className="flex flex-col justify-between gap-3">
                    <div className="text-[#888888] text-[13px] font-m">
                      {e.label}
                    </div>

                    {i === 9 ? (
                      <div className="flex gap-2 flex-wrap text-[12px]">
                        <input
                          type="text"
                          className="border rounded-md border-gray-400 text-center w-[50px] text-black"
                          placeholder={valve || "NA"}
                          onChange={(e) => setValve(e.target.value)}
                        />
                        <button
                          className="px-[9px] py-[4px] bg-[rgba(12,184,211,0.75)] hover:bg-[rgba(12,184,211,1)] text-white rounded-md font-sb cursor-pointer"
                          onClick={() => {
                            clickHandler(speed, valve);
                          }}
                        >
                          Change
                        </button>
                      </div>
                    ) : i === 8 ? (
                      // <div className="text-[#0cb8d3] text-[20px] font-sb leading-[15px]">
                      //   {apiData ? apiData[e.key] : "NA"}
                      // </div>
                      <div className="text-[#0cb8d3] text-[20px] font-sb leading-[15px]">
                        {apiData ? aqi : "NA"}
                      </div>
                    ) : (
                      <div className="text-[#0cb8d3] text-[20px] font-sb leading-[15px]">
                        {apiData ? apiData[e.key] : "NA"}
                      </div>
                    )}
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
                {/* <Line ref={chartRef2} options={options} data={data2} /> */}
                {graphData && (
                  <Graph
                    data={graphData}
                    colorOne={"rgba(52,98,236,1)"}
                    colorTwo={"rgba(173,193,255,1)"}
                    labelOne={"ambientTemperature"}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
