import CircularProgress from "./CircularProgress";
import HorizontalProgress from "./HorizontalProgress";

const OutsideAirQuality = ({ outsideAQIData }) => {
  return (
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
  );
};

export default OutsideAirQuality;
