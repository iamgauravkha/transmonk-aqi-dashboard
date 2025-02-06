import React from "react";
// import {
//   CloudIcon,
//   DropsIcon,
//   ThermometerIcon,
//   WifiIcon,
//   FireIcon,
//   EyeIcon,
//   HeartIcon,
// //   ChipIcon,
//   BeakerIcon,
// } from "@heroicons/react/24/solid"; // Import icons

const Dashboard = () => {
  const metrics = [
    {
      label: "Temperature",
      value: "29°C",
      //   icon: <ThermometerIcon className="h-6 w-6 text-blue-500" />,
    },
    {
      label: "RH",
      value: "29°C",
      //   icon: <DropsIcon className="h-6 w-6 text-gray-500" />,
    },
    {
      label: "CO2",
      value: "450 ppm",
      //   icon: <FireIcon className="h-6 w-6 text-red-500" />,
    },
    {
      label: "PM 2.5",
      value: "72",
      //   icon: <CloudIcon className="h-6 w-6 text-gray-600" />,
    },
    {
      label: "Fan RPM",
      value: "600",
      //   icon: <WifiIcon className="h-6 w-6 text-green-500" />,
    },
    {
      label: "Fan Capacity",
      value: "24%",
      //   icon: <EyeIcon className="h-6 w-6 text-yellow-500" />,
    },
    {
      label: "Power",
      value: "49 W",
      //   icon: <ChipIcon className="h-6 w-6 text-purple-500" />,
    },
    {
      label: "Pressure (DP)",
      value: "200",
      //   icon: <BeakerIcon className="h-6 w-6 text-pink-500" />,
    },
  ];

  const fanSpeed = 20;
  const aqi = 103;
  const valvePercentage = "38%";

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">TRANSMONK</h1>
            <p className="text-sm text-gray-600">simply precise.</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center mb-2">
                {metric?.icon}
                <span className="ml-2 font-medium text-gray-800">
                  {metric.label}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            </div>
          ))}

          {/* Fan Speed and AQI */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="font-medium text-gray-800">Fan Speed (%)</p>
            <div className="flex items-center mt-2">
              <div className="bg-blue-500 rounded-full h-8 w-16 mr-2">
                <div className="bg-white rounded-full h-6 w-6 ml-1.5 mt-1">
                  <p className="text-center text-blue-500">{fanSpeed}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{fanSpeed}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="font-medium text-gray-800">AQI</p>
            <div className="flex items-center mt-2">
              <div className="bg-green-500 rounded-full h-8 w-16 mr-2">
                <div className="bg-white rounded-full h-6 w-6 ml-1.5 mt-1">
                  <p className="text-center text-green-500">{aqi}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{aqi}</p>
            </div>
          </div>

          {/* Power and Valve */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="font-medium text-gray-800">Power (Watts)</p>
            {/* Add chart here (e.g., with Recharts) */}
            <div className="h-20 bg-gray-200 mt-2 rounded"></div>{" "}
            {/* Placeholder */}
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="font-medium text-gray-800">Valve %</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {valvePercentage}
            </p>
          </div>

          {/* Temperature Chart */}
          <div className="col-span-1 md:col-span-2 lg:col-span-4 bg-white rounded-lg shadow p-4">
            <p className="font-medium text-gray-800">Temperature (°C)</p>
            {/* Add chart here (e.g., with Recharts) */}
            <div className="h-20 bg-gray-200 mt-2 rounded"></div>{" "}
            {/* Placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
