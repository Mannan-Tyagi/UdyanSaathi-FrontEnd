import React, { useState, useEffect } from "react";
import { getBaseUrl, getStationName } from "../Connectivity/storageHelper";

const Component8 = (selectedSearch) => {
  const [apiData, setApiData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2024");

  useEffect(() => {
    getAqiCalData();
  }, [selectedSearch]);

  const getAqiCalData = async () => {
    const selectstation = getStationName();
    try {
      const baseurl = getBaseUrl();
      const response = await fetch(`${baseurl}get-AqiCalData/?pol_Station=${selectstation}`);
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const filteredData = apiData.filter((entry) =>
    selectedYear ? entry.Pol_Date?.startsWith(selectedYear) : false
  );

  const monthsData = filteredData.reduce((acc, entry) => {
    const month = entry.Pol_Date?.split("-")[1];
    if (month) {
      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(entry);
    }
    return acc;
  }, {});

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const getColorBasedOnAQI = (aqi) => {
    if (aqi <= 50) return "#34a12b";
    if (aqi <= 100) return "#ecc93d";
    if (aqi <= 200) return "#e9572a";
    if (aqi <= 300) return "#ec4d9f";
    if (aqi <= 400) return "#9858a2";
    return "#c11e2f";
  };

  const uniqueYears = [...new Set(apiData.map((entry) => entry.Pol_Date?.split("-")[0]))].sort();

  return (
    <div className="m-4 sm:m-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h1 className="text-xl sm:text-2xl text-ink font-bold text-start mb-2 sm:mb-0">
          AQI Heat Map
        </h1>
        <div className="lg:flex grid grid-cols-3 lg:flex-row">
          <div className="w-20 sm:w-24 h-7 bg-aqi-good flex justify-center items-center m-1 rounded">
            <span className="text-white text-sm">0 - 50</span>
          </div>
          <div className="w-20 sm:w-24 h-7 bg-aqi-satisfactory flex justify-center items-center m-1 rounded">
            <span className="text-white text-sm">51 - 100</span>
          </div>
          <div className="w-20 sm:w-24 h-7 bg-aqi-moderate flex justify-center items-center m-1 rounded">
            <span className="text-white text-sm">101 - 200</span>
          </div>
          <div className="w-20 sm:w-24 h-7 bg-aqi-poor flex justify-center items-center m-1 rounded">
            <span className="text-white text-sm">201 - 300</span>
          </div>
          <div className="w-20 sm:w-24 h-7 bg-aqi-veryPoor flex justify-center items-center m-1 rounded">
            <span className="text-white text-sm">301 - 400</span>
          </div>
          <div className="w-20 sm:w-24 h-7 bg-aqi-severe flex justify-center items-center m-1 rounded">
            <span className="text-white text-sm">401 - 500</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2 mt-4 sm:mt-2 items-center">
        <label className="text-sm font-medium text-metal">Select Year: </label>
        <select value={selectedYear} onChange={handleYearChange} className="select-input">
          {uniqueYears.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {selectedYear && (
        <div className="mt-5 flex flex-col sm:flex-row flex-wrap gap-4">
          {Object.entries(monthsData)
            .sort((a, b) => a[0] - b[0])
            .map(([month, dates], index) => (
              <div key={index} className="p-4 flex flex-col sm:w-1/12 gap-2.5 w-full sm:w-auto">
                <div>
                  <p>{monthNames[parseInt(month, 10) - 1]}</p>
                </div>
                <div className="flex flex-wrap gap-[7px]">
                  {dates.map((date, innerIndex) => (
                    <div
                      key={innerIndex}
                      className="innerbx1 w-5 h-5"
                      style={{ backgroundColor: getColorBasedOnAQI(date.AQI) }}
                      title={`Date: ${date.Pol_Date} AQI: ${date.AQI}`}
                    ></div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Component8;
