import toast from "react-hot-toast";
import CircularProgress from "./CircularProgress";
import HorizontalProgress from "./HorizontalProgress";

const InsideAirQuality = ({ insideAQIData, setGraph, averageData }) => {
  return (
    <div className="py-5 flex flex-col  gap-5">
      <h2 className="text-xl font-b text-green-600 mb-2">
        Indoor Air Quality{" "}
        <span
          className="text-sm text-blue-800 cursor-pointer"
          onClick={() =>
            averageData
              ? setGraph(true)
              : toast.error("Please wait graph is loading...")
          }
        >
          (View Graph)
        </span>
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
        <CircularProgress
          value={insideAQIData.sensorsData.pm_2_5}
          heading="PM2.5"
          unit={"µg/m³"}
          max={1000}
        />
        <CircularProgress
          value={insideAQIData.sensorsData.pm_10}
          heading="PM10"
          unit={"µg/m³"}
          max={1000}
        />
        <CircularProgress
          value={insideAQIData.sensorsData.co_2}
          heading="CO2"
          unit={"ppm"}
          max={2000}
        />
      </div>
      <HorizontalProgress
        value={insideAQIData.sensorsData.temperature}
        heading="Temperature"
        unit={"°C"}
        max={100}
      />
      <HorizontalProgress
        value={insideAQIData.sensorsData.humidity}
        heading="Humidity"
        unit={"%"}
        max={100}
      />
      <HorizontalProgress
        value={insideAQIData.sensorsData.vocIndex}
        heading="VOC Index"
        unit={"ppb"}
        max={500}
      />
    </div>
  );
};

export default InsideAirQuality;
