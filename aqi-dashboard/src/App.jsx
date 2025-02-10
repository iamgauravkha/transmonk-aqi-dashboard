import { useEffect, useState } from "react";
import CircularProgress from "./components/CircularProgress";
import HorizontalProgress from "./components/HorizontalProgress";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  calculateAQI,
  getAQICategory,
  PM10_BREAKPOINTS,
  PM25_BREAKPOINTS,
} from "./utils/aqiUtils";
import Navbar from "./components/Navbar";
import Graph from "./components/Graph";
import toast from "react-hot-toast";
import OutsideAirQuality from "./components/OutsideAirQuality";
import InsideAirQuality from "./components/InsideAirQuality";

const App = () => {
  const [location, setLocation] = useState(null);
  const [graph, setGraph] = useState(false);
  const [insideAQIColor, setInsideAQIColor] = useState("");
  const [insideAQICategory, setInsideAQICategory] = useState("");
  const [outsideAQIColor, setoutsideAQIColor] = useState("");
  const [outsideAQICategory, setoutsideAQICategory] = useState("");
  const [averageData, setAverageData] = useState(null);

  const [outsideAQIData, setOutsideAQIData] = useState(
    // {
    // updatedAt: null,
    // aqi: 0,
    // sensorsData: {
    //   pm_2_5: 0,
    //   pm_10: 0,
    //   co_2: 0,
    //   temperature: 0,
    //   humidity: 0,
    //   vocIndex: 0,
    // },
    // }
    null
  );

  const [insideAQIData, setInsideAQIData] = useState(
    // {
    // updatedAt: null,
    // aqi: 0,
    // sensorsData: {
    //   pm_2_5: 0,
    //   pm_10: 0,
    //   co_2: 0,
    //   temperature: 0,
    //   humidity: 0,
    //   vocIndex: 0,
    // },
    // }
    null
  );

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
      const API_KEY = "f6c9e22dafffd36795dc46c3a2ecc0b1";
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
          co_2: 0,
          temperature: API_2?.main?.temp / 10 || 0,
          humidity: API_2?.main?.humidity || 0,
          vocIndex: 0,
        },
      });
    } catch (error) {
      console.error("Error fetching AQI:", error);
    }
  };

  const fetchInsideAQI = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_ENVIRONMENT
          ? `http://localhost:4500/api/v1/sensor-data`
          : `https://transmonk-aqi-dash.onrender.com/api/v1/sensor-data`
      );

      const API = await res.json();
      let date = new Date().toLocaleString();
      const aqiPM25 = Math.round(
        calculateAQI(API?.massConcentrationPm2p5?.value || 0, PM25_BREAKPOINTS)
      );
      const aqiPM10 = Math.round(
        calculateAQI(API?.massConcentrationPm10p0?.value || 0, PM10_BREAKPOINTS)
      );
      const overallAQI = Math.max(aqiPM25, aqiPM10);
      const { category, color } = getAQICategory(overallAQI);

      setInsideAQIColor(color);
      setInsideAQICategory(category);
      setInsideAQIData({
        updatedAt: date,
        aqi: overallAQI || 0,
        sensorsData: {
          pm_2_5: API?.massConcentrationPm2p5?.value || 0,
          pm_10: API?.massConcentrationPm10p0?.value || 0,
          co_2: API?.cO2?.value || 0,
          temperature: API?.ambientTemperature?.value || 0,
          humidity: API?.ambientHumidity?.value || 0,
          vocIndex: API?.vocIndex?.value || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching AQI:", error);
    }
  };

  const fetchAverageData = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_ENVIRONMENT
          ? `http://localhost:4500/api/v1/average-data`
          : `https://transmonk-aqi-dash.onrender.com/api/v1/average-data`
      );

      const resData = await res.json();
      setAverageData(resData[0]);
    } catch (error) {}
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

  useEffect(() => {
    fetchAverageData();
  }, []);

  return (
    <div className="w-full relative min-h-screen xl:h-screen xl:overflow-hidden">
      <img
        src="/shade-left.png"
        alt=""
        className="absolute top-0 left-0 z-[-1] h-full object-cover"
      />
      <img
        src="/shade-right.png"
        alt=""
        className="absolute top-0 right-0 z-[-1] h-full object-cover hidden lg:flex"
      />
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10">
        {/* Navbar */}
        <Navbar location={location} />
      </div>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 flex flex-col gap-5">
        <div className=" py-5 flex flex-col items-center gap-5 lg:hidden">
          <h2 className="text-2xl font-sb text-blue-500 mb-2">
            Air Quality Index
          </h2>
          <div className="flex w-full justify-around ">
            <div className="flex flex-col items-center gap-3  w-[150px]">
              <div
                className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-blue-400 text-white text-2xl font-b`}
                style={{ background: `${outsideAQIColor}` }}
              >
                {outsideAQIData ? (
                  outsideAQIData?.aqi
                ) : (
                  <span className="text-xs">Loading...</span>
                )}
                <h3 className="text-sm">Outside AQI</h3>
              </div>
              <p
                className="text-sm font-sb text-center"
                style={{ color: `${outsideAQIColor}` }}
              >
                {outsideAQICategory || "Loading..."}
              </p>
            </div>
            <div className="flex flex-col items-center gap-3  w-[150px]">
              <div
                className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-blue-400 text-white text-2xl font-b`}
                style={{ background: `${insideAQIColor}` }}
              >
                {insideAQIData ? (
                  insideAQIData.aqi
                ) : (
                  <span className="text-xs">Loading...</span>
                )}
                <h3 className="text-sm">Inside AQI</h3>
              </div>
              <p
                className="text-sm font-sb text-center"
                style={{ color: `${insideAQIColor}` }}
              >
                {insideAQICategory || "Loading..."}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 flex flex-col items-center gap-2">
            Last updated
            <span className="text-xs text-black">
              {outsideAQIData ? outsideAQIData.updatedAt : "Loading..."}
            </span>
          </p>
          <img
            src="/forest.jpg"
            alt="Forest"
            className="w-[100%] mt-[-105px] sm:mt-[-350px] opacity-[100%] sm:opacity-[60%] z-[-1] mix-blend-multiply"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-10 py-5">
          {/* Outdoor Air Quality Section */}

          {outsideAQIData ? (
            <OutsideAirQuality outsideAQIData={outsideAQIData} />
          ) : (
            <Skeleton
              count={5}
              height={120}
              baseColor="#E5E7EB"
              borderRadius={10}
            />
          )}

          {/* AQI Display */}
          <div className=" py-5 flex-col items-center gap-5 hidden lg:flex">
            <h2 className="text-2xl font-sb text-blue-500 mb-2">
              Air Quality Index
            </h2>
            <div className="flex w-full justify-around ">
              <div className="flex flex-col items-center gap-3  w-[150px]">
                <div
                  className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-blue-400 text-white text-2xl font-b`}
                  style={{ background: `${outsideAQIColor}` }}
                >
                  {outsideAQIData ? (
                    outsideAQIData.aqi
                  ) : (
                    <span className="text-xs">Loading...</span>
                  )}
                  <h3 className="text-sm">Outside AQI</h3>
                </div>
                <p
                  className="text-sm font-sb text-center"
                  style={{ color: `${outsideAQIColor}` }}
                >
                  {outsideAQICategory || "Loading..."}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3  w-[150px]">
                <div
                  className={`h-30 w-30 flex flex-col items-center justify-center rounded-full bg-blue-400 text-white text-2xl font-b`}
                  style={{ background: `${insideAQIColor}` }}
                >
                  {insideAQIData ? (
                    insideAQIData.aqi
                  ) : (
                    <span className="text-xs">Loading...</span>
                  )}
                  <h3 className="text-sm">Inside AQI</h3>
                </div>
                <p
                  className="text-sm font-sb text-center"
                  style={{ color: `${insideAQIColor}` }}
                >
                  {insideAQICategory || "Loading..."}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 flex flex-col items-center gap-2">
              Last updated
              <span className="text-xs text-black">
                {outsideAQIData ? outsideAQIData.updatedAt : "Loading..."}
              </span>
            </p>
            <img
              src="/forest.jpg"
              alt="Forest"
              className="w-[90%] my-[-10px]  z-[-2]"
            />
          </div>
          {/* Outdoor Air Quality Section */}
          {insideAQIData ? (
            <InsideAirQuality
              insideAQIData={insideAQIData}
              setGraph={setGraph}
              averageData={averageData}
            />
          ) : (
            <Skeleton
              count={5}
              height={120}
              baseColor="#E5E7EB"
              borderRadius={10}
            />
          )}
        </div>
      </div>
      {graph && <Graph data={averageData} setGraph={setGraph} />}
    </div>
  );
};

export default App;
