import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../Connectivity/storageHelper";

/**
 * Smart City Glass & Grid Design System - Most Polluted Cities
 */
const Component3 = () => {
  const [citiesData, setCitiesData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("last-day");
  const [selectedParameter, setSelectedParameter] = useState("AQI");
  const [error, setError] = useState(null);
  const options = ["last-day", "last-7-days", "last-month"];
  const AqiOptions = ["CO", "NH3", "NO2", "OZONE", "PM25", "PM10", "SO2", "AQI"];

  useEffect(() => {
    fetchData();
  }, [selectedOption, selectedParameter]);

  const fetchData = async () => {
    try {
      const to_date = getDateRange(selectedOption);
      const airQualityData = await fetchAirQualityData(to_date, selectedParameter);
      setCitiesData(airQualityData);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    }
  };

  const getDateRange = (interval) => {
    let to_date = 1;
    if (interval === "last-day") to_date = 1;
    else if (interval === "last-7-days") to_date = 6;
    else if (interval === "last-month") to_date = 30;
    return String(to_date);
  };

  const fetchAirQualityData = async (to_date, parameter) => {
    try {
      const baseurl = getBaseUrl();
      const url = `${baseurl}get-Top10Cities/?to_date=${to_date}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  };

  // Get badge color based on AQI value
  const getAqiBadgeClass = (value) => {
    if (value <= 50) return 'bg-status-safe/10 text-status-safe';
    if (value <= 100) return 'bg-yellow-100 text-yellow-700';
    if (value <= 150) return 'bg-status-warning/10 text-status-warning';
    if (value <= 200) return 'bg-status-danger/10 text-status-danger';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary">
          Most Polluted Cities
        </h3>
        <p className="text-sm text-metal mt-1">
          Real-time worst city rankings in India
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          className="input-field text-sm py-2 px-3"
          onChange={(e) => setSelectedOption(e.target.value)}
          value={selectedOption}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
        <select
          className="input-field text-sm py-2 px-3"
          onChange={(e) => setSelectedParameter(e.target.value)}
          value={selectedParameter}
        >
          {AqiOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      {error ? (
        <div className="alert-danger">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-mist">
          <table className="data-table">
            <thead>
              <tr>
                <th className="w-16">#</th>
                <th>City</th>
                <th className="text-right">{selectedParameter}</th>
              </tr>
            </thead>
            <tbody>
              {citiesData.map((city, index) => (
                <tr key={index}>
                  <td>
                    <span className="text-metal font-medium">{index + 1}</span>
                  </td>
                  <td>
                    <span className="text-ink font-medium">{city.City}</span>
                  </td>
                  <td className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${getAqiBadgeClass(city[selectedParameter])}`}>
                      {city[selectedParameter] !== 0 ? city[selectedParameter] : 'N/A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Component3;
