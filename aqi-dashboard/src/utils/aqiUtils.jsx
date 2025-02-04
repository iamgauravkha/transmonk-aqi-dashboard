export const PM25_BREAKPOINTS = [
  { cLow: 0, cHigh: 12, iLow: 0, iHigh: 50 },
  { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
  { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
  { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
  { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
  { cLow: 250.5, cHigh: 500, iLow: 301, iHigh: 500 },
];

export const PM10_BREAKPOINTS = [
  { cLow: 0, cHigh: 54, iLow: 0, iHigh: 50 },
  { cLow: 55, cHigh: 154, iLow: 51, iHigh: 100 },
  { cLow: 155, cHigh: 254, iLow: 101, iHigh: 150 },
  { cLow: 255, cHigh: 354, iLow: 151, iHigh: 200 },
  { cLow: 355, cHigh: 424, iLow: 201, iHigh: 300 },
  { cLow: 425, cHigh: 604, iLow: 301, iHigh: 500 },
];

export const calculateAQI = (concentration, breakpoints) => {
  for (const bp of breakpoints) {
    const { cLow, cHigh, iLow, iHigh } = bp;
    if (concentration >= cLow && concentration <= cHigh) {
      return ((iHigh - iLow) / (cHigh - cLow)) * (concentration - cLow) + iLow;
    }
  }
  return null; // Out of range
};

export const getAQICategory = (aqi) => {
  if (aqi <= 50) return { category: "Good", color: "green" };
  if (aqi <= 100) return { category: "Moderate", color: "yellow" };
  if (aqi <= 150)
    return { category: "Unhealthy for Sensitive Groups", color: "orange" };
  if (aqi <= 200) return { category: "Unhealthy", color: "red" };
  if (aqi <= 300) return { category: "Very Unhealthy", color: "purple" };
  return { category: "Hazardous", color: "maroon" };
};
