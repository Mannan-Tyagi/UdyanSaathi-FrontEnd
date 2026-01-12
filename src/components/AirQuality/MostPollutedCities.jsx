import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../Connectivity/storageHelper";

/**
 * Most Polluted Cities - Clean, Minimal Design
 */
const Component3 = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("last-day");
  const [selectedParameter, setSelectedParameter] = useState("AQI");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const options = [
    { value: "last-day", label: "Last Day" },
    { value: "last-7-days", label: "Last 7 Days" },
    { value: "last-month", label: "Last Month" }
  ];
  const AqiOptions = ["AQI", "PM25", "PM10", "NO2", "SO2", "CO", "OZONE", "NH3"];

  useEffect(() => {
    fetchData();
  }, [selectedOption, selectedParameter]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const to_date = getDateRange(selectedOption);
      const airQualityData = await fetchAirQualityData(to_date, selectedParameter);
      setCitiesData(airQualityData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const getDateRange = (interval) => {
    if (interval === "last-day") return "1";
    if (interval === "last-7-days") return "6";
    if (interval === "last-month") return "30";
    return "1";
  };

  const fetchAirQualityData = async (to_date) => {
    const baseurl = getBaseUrl();
    const response = await fetch(`${baseurl}get-Top10Cities/?to_date=${to_date}`);
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  };

  const getAqiBadgeStyle = (value) => {
    if (value <= 50) return 'bg-status-good/10 text-status-good';
    if (value <= 100) return 'bg-aqi-moderate/20 text-aqi-moderate';
    if (value <= 200) return 'bg-status-moderate/15 text-status-moderate';
    if (value <= 300) return 'bg-aqi-poor/20 text-aqi-poor';
    return 'bg-status-critical/15 text-status-critical';
  };

  return (
    <div className="space-y-4">
      {/* Compact Filters */}
      <div className="flex gap-2">
        <select
          className="flex-1 text-xs bg-canvas border border-mist rounded-lg px-3 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          onChange={(e) => setSelectedOption(e.target.value)}
          value={selectedOption}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select
          className="w-20 text-xs bg-canvas border border-mist rounded-lg px-2 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          onChange={(e) => setSelectedParameter(e.target.value)}
          value={selectedParameter}
        >
          {AqiOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {/* Data List */}
      {error ? (
        <div className="text-center py-8 text-status-critical text-sm">{error}</div>
      ) : isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 px-3 bg-canvas rounded-lg animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-mist rounded"></div>
                <div className="w-24 h-4 bg-mist rounded"></div>
              </div>
              <div className="w-12 h-6 bg-mist rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {/* Header Row */}
          <div className="flex items-center justify-between px-3 py-2 text-xs text-metal font-medium">
            <span>#</span>
            <span className="flex-1 ml-4">CITY</span>
            <span>{selectedParameter}</span>
          </div>
          
          {/* Data Rows */}
          {citiesData.slice(0, 6).map((city, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2.5 px-3 bg-canvas/50 hover:bg-canvas rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-xs text-metal font-medium">{index + 1}</span>
                <span className="text-sm text-ink font-medium group-hover:text-primary transition-colors">
                  {city.City}
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${getAqiBadgeStyle(city[selectedParameter])}`}>
                {city[selectedParameter] || 'N/A'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Component3;
