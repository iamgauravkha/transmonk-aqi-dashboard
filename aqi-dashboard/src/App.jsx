import { useEffect, useState } from "react";
import CircularProgress from "./components/CircularProgress";
import HorizontalProgress from "./components/HorizontalProgress";
import {
  calculateAQI,
  getAQICategory,
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
} from "./utils/aqiUtils";
import Navbar from "./components/Navbar";

const App = () => {
  const [location, setLocation] = useState("Fetching Location...");
  const [outsideAQIData, setOutsideAQIData] = useState({
    updatedAt: null,
    aqi: 0,
    sensorsData: {
      pm_2_5: 0,
      pm_10: 0,
      co_2: 0,
      temperature: 0,
      humidity: 0,
      vocIndex: 0,
    },
  });

  const [insideAQIData, setInsideAQIData] = useState({
    updatedAt: null,
    aqi: 0,
    sensorsData: {
      pm_2_5: 0,
      pm_10: 0,
      co_2: 0,
      temperature: 0,
      humidity: 0,
      vocIndex: 0,
    },
  });

  const [insideAQIColor, setInsideAQIColor] = useState("");
  const [insideAQICategory, setInsideAQICategory] = useState("");
  const [outsideAQIColor, setoutsideAQIColor] = useState("");
  const [outsideAQICategory, setoutsideAQICategory] = useState("");

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem("lat", latitude);
          localStorage.setItem("long", longitude);
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          )
            .then((response) => response.json())
            .then((data) => {
              setLocation(
                data?.address?.city ||
                  data?.address?.state_district?.split(" ")[0] ||
                  "Unknown location"
              );
              fetchOutsideAQI(latitude, longitude);
              fetchInsideAQI();
            })
            .catch(() => setLocation("Error fetching location"));
        },
        () => setLocation("Location access denied")
      );
    } else {
      setLocation("Geolocation not supported");
    }
  };

  const fetchOutsideAQI = async (latitude, longitude) => {
    try {
      const API_KEY = "f6c9e22dafffd36795dc46c3a2ecc0b1"; // Ensure this is valid
      const airPollutionAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );
      const weatherAPIResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
      );

      if (!airPollutionAPIResponse.ok || !weatherAPIResponse.ok) {
        throw new Error("Failed to fetch API data");
      }

      const API_1 = await airPollutionAPIResponse.json();
      const API_2 = await weatherAPIResponse.json();

      let date = API_1?.list?.[0]?.dt
        ? new Date(API_1.list[0].dt * 1000).toLocaleString()
        : new Date().toLocaleString();

      const aqiPM25 = Math.round(
        calculateAQI(API_1?.list?.[0]?.components?.pm2_5 || 0, PM25_BREAKPOINTS)
      );
      const aqiPM10 = Math.round(
        calculateAQI(API_1?.list?.[0]?.components?.pm10 || 0, PM10_BREAKPOINTS)
      );
      const overallAQI = Math.max(aqiPM25, aqiPM10);
      const { category, color } = getAQICategory(overallAQI);
      setoutsideAQIColor(color);
      setoutsideAQICategory(category);

      setOutsideAQIData({
        updatedAt: date,
        aqi: overallAQI || 0,
        sensorsData: {
          pm_2_5: API_1?.list?.[0]?.components?.pm2_5 || 0,
          pm_10: API_1?.list?.[0]?.components?.pm10 || 0,
          co_2: 0, // OpenWeather API doesn’t provide CO2
          temperature: API_2?.main?.temp / 10 || 0,
          humidity: API_2?.main?.humidity || 0,
          vocIndex: 0, // VOC Index not provided by API
        },
      });
    } catch (error) {
      console.error("Error fetching AQI:", error);
    }
  };

  let colour = "";
  const fetchInsideAQI = async () => {
    try {
      const res = await fetch(
        `https://transmonk-aqi-dashboard.onrender.com/api/v1/sensor-data`
      );
      // const res = await fetch(`http://localhost:4500/api/v1/sensor-data`);

      const API = await res.json();

      let date = new Date().toLocaleString();

      const aqiPM25 = Math.round(
        calculateAQI(
          API[0]?.massConcentrationPm2p5[
            API[0]?.massConcentrationPm2p5?.length - 1
          ]?.value || 0,
          PM25_BREAKPOINTS
        )
      );
      const aqiPM10 = Math.round(
        calculateAQI(
          API[0]?.massConcentrationPm10p0[
            API[0]?.massConcentrationPm10p0?.length - 1
          ]?.value || 0,
          PM10_BREAKPOINTS
        )
      );
      const overallAQI = Math.max(aqiPM25, aqiPM10);
      const { category, color } = getAQICategory(overallAQI);

      setInsideAQIColor(color);
      setInsideAQICategory(category);

      setInsideAQIData({
        updatedAt: date,
        aqi: overallAQI || 0,
        sensorsData: {
          pm_2_5:
            API[0]?.massConcentrationPm2p5[
              API[0]?.massConcentrationPm2p5?.length - 1
            ]?.value || 0,
          pm_10:
            API[0]?.massConcentrationPm10p0[
              API[0]?.massConcentrationPm10p0?.length - 1
            ]?.value || 0,
          co_2: API[0]?.cO2[API[0]?.cO2?.length - 1]?.value || 0,
          temperature:
            API[0]?.ambientTemperature[API[0]?.ambientTemperature?.length - 1]
              ?.value || 0,
          humidity:
            API[0]?.ambientHumidity[API[0]?.ambientHumidity?.length - 1]
              ?.value || 0,
          vocIndex: API[0]?.vocIndex[API[0]?.vocIndex?.length - 1]?.value || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching AQI:", error);
    }
  };

  useEffect(() => {
    fetchLocation();
    const interval = setInterval(() => {
      fetchInsideAQI();
      fetchOutsideAQI(
        localStorage.getItem("lat"),
        localStorage.getItem("long")
      );
    }, 300000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {}, [insideAQIData, outsideAQIData]);

  return (
    <div className="w-full">
      <img
        src="/shade-left.png"
        alt=""
        className="absolute top-0 left-0 z-[-1] h-full object-cover hidden sm:flex"
      />
      <img
        src="/shade-right.png"
        alt=""
        className="absolute top-0 right-0 z-[-1] h-full object-cover hidden sm:flex"
      />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">
        {/* Navbar */}
        <Navbar location={location} />
      </div>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 py-5 flex flex-col gap-5">
        <div className=" py-5 flex flex-col items-center gap-5 sm:hidden">
          <h2 className="text-2xl font-sb text-blue-700 mb-2">
            Air Quality Index
          </h2>
          <div className="flex w-full justify-around ">
            <div className="flex flex-col items-center gap-3">
              <div
                className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-blue-300 text-white text-2xl font-b`}
                style={{ background: `${outsideAQIColor}` }}
              >
                {outsideAQIData.aqi}
                <h3 className="text-sm">Outside AQI</h3>
              </div>
              <p
                className="text-sm font-sb"
                style={{ color: `${outsideAQIColor}` }}
              >
                {outsideAQICategory}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div
                className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-[green] text-white text-2xl font-b`}
                style={{ background: `${insideAQIColor}` }}
              >
                {insideAQIData.aqi}
                <h3 className="text-sm">Inside AQI</h3>
              </div>
              <p
                className="text-sm font-sb"
                style={{ color: `${insideAQIColor}` }}
              >
                {insideAQICategory}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 flex flex-col items-center gap-2">
            Last updated
            <span className="text-xs text-black">
              {outsideAQIData.updatedAt}
            </span>
          </p>
          <img
            src="/forest.jpg"
            alt="Forest"
            className="w-[100%] mt-[-105px] z-[-1]"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-10">
          {/* Outdoor Air Quality Section */}
          <div className="py-5 flex flex-col gap-5">
            <h2 className="text-xl font-b text-green-600 mb-2">
              Outdoor Air Quality
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <CircularProgress
                value={outsideAQIData.sensorsData.pm_2_5}
                heading="PM2.5"
                unit={"µg/m³"}
                max={1000}
              />
              <CircularProgress
                value={outsideAQIData.sensorsData.pm_10}
                heading="PM10"
                unit={"µg/m³"}
                max={1000}
              />
              <CircularProgress
                value={outsideAQIData.sensorsData.co_2}
                heading="CO2"
                unit={"ppm"}
                max={2000}
              />
            </div>
            <HorizontalProgress
              value={outsideAQIData.sensorsData.temperature}
              heading="Temperature"
              unit={"°C"}
              max={100}
            />
            <HorizontalProgress
              value={outsideAQIData.sensorsData.humidity}
              heading="Humidity"
              unit={"%"}
              max={100}
            />
            <HorizontalProgress
              value={outsideAQIData.sensorsData.vocIndex}
              heading="VOC Index"
              unit={"ppb"}
              max={500}
            />
          </div>

          {/* AQI Display */}
          <div className=" py-5 flex-col items-center gap-5 hidden sm:flex">
            <h2 className="text-2xl font-sb text-blue-700 mb-2">
              Air Quality Index
            </h2>
            <div className="flex w-full justify-around ">
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-blue-300 text-white text-2xl font-b`}
                  style={{ background: `${outsideAQIColor}` }}
                >
                  {outsideAQIData.aqi}
                  <h3 className="text-sm">Outside AQI</h3>
                </div>
                <p
                  className="text-sm font-sb"
                  style={{ color: `${outsideAQIColor}` }}
                >
                  {outsideAQICategory}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div
                  className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-[green] text-white text-2xl font-b`}
                  style={{ background: `${insideAQIColor}` }}
                >
                  {insideAQIData.aqi}
                  <h3 className="text-sm">Inside AQI</h3>
                </div>
                <p
                  className="text-sm font-sb"
                  style={{ color: `${insideAQIColor}` }}
                >
                  {insideAQICategory}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 flex flex-col items-center gap-2">
              Last updated
              <span className="text-xs text-black">
                {outsideAQIData.updatedAt}
              </span>
            </p>
            <img src="/forest.jpg" alt="Forest" className="w-[100%] z-[-2]" />
          </div>
          {/* Outdoor Air Quality Section */}
          <div className="py-5 flex flex-col  gap-5">
            <h2 className="text-xl font-b text-green-600 mb-2">
              Indoor Air Quality
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <CircularProgress
                value={insideAQIData.sensorsData.pm_2_5}
                heading="PM2.5"
                unit={"µg/m³"}
              />
              <CircularProgress
                value={insideAQIData.sensorsData.pm_10}
                heading="PM10"
                unit={"µg/m³"}
              />
              <CircularProgress
                value={insideAQIData.sensorsData.co_2}
                heading="CO2"
                unit={"ppm"}
              />
            </div>
            <HorizontalProgress
              value={insideAQIData.sensorsData.temperature}
              heading="Temperature"
              unit={"°C"}
            />
            <HorizontalProgress
              value={insideAQIData.sensorsData.humidity}
              heading="Humidity"
              unit={"%"}
            />
            <HorizontalProgress
              value={insideAQIData.sensorsData.vocIndex}
              heading="VOC Index"
              unit={"ppb"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
