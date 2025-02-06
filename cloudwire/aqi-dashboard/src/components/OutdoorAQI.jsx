import { useState } from "react";

const OutdoorAQI = () => {
  const [aqiData, setAqiData] = useState({
    aqi: null,
    temperature: null,
    humidity: null,
    vocIndex: null,
    pm_2_5: null,
    pm_10: null,
    co_2: null,
    dt: null,
  });
  return <div>OutdoorAQI</div>;
};

export default OutdoorAQI;
