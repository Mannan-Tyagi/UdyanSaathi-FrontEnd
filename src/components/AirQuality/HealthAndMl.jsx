import React, { useEffect, useState } from "react";
import { getBaseUrl, getStationName, getTodayDate } from "../Connectivity/storageHelper";

/**
 * Smart City Glass & Grid Design System - Health Advice & ML Forecast
 */
const Component4 = (selectedSearch) => {
  const [aqiData, setAqiData] = useState(null);
  const [next3Dates, setNext3Dates] = useState([]);

  useEffect(() => {
    getPollutionData();
    generateNext3Dates();
  }, [selectedSearch]);

  const generateNext3Dates = () => {
    try {
      const todaydate = getTodayDate();
      if (!todaydate) throw new Error("Today's date is invalid or not provided.");
      
      const dateWithoutTime = todaydate.split(" ")[0];
      const startDate = new Date(dateWithoutTime);
      const upcomingDates = [];

      for (let i = 1; i < 4; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const options = { day: 'numeric', month: 'short' };
        const formattedDate = currentDate.toLocaleString('en-US', options);
        upcomingDates.push(formattedDate);
      }

      setNext3Dates(upcomingDates);
    } catch (error) {
      console.error("Error generating the next 3 dates:", error.message);
    }
  };

  const getPollutionData = async () => {
    try {
      const selectstation = getStationName();
      const baseurl = getBaseUrl();
      const response = await fetch(
        `${baseurl}get-MLData/?pol_Station=${selectstation}`
      );

      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setAqiData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  // Precaution items
  const precautions = [
    { icon: '/precautions/wear-mask-icon.webp', label: 'Wear Mask', status: 'Required' },
    { icon: '/precautions/Stay-Indoors-icon.webp', label: 'Stay Indoor', status: 'Required' },
    { icon: '/precautions/Shut-Openings-icon-cross.webp', label: 'Windows', status: 'Keep Close' },
    { icon: '/precautions/Use-a-purifier-icon.webp', label: 'Use Purifier', status: 'Required' },
    { icon: '/precautions/family-icon-cross.webp', label: 'Family', status: 'Allow Outdoor' },
  ];

  // Get AQI color for forecast
  const getAqiColor = (value) => {
    if (value <= 50) return 'bg-status-safe/10 text-status-safe border-status-safe/20';
    if (value <= 100) return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    if (value <= 150) return 'bg-status-warning/10 text-status-warning border-status-warning/20';
    if (value <= 200) return 'bg-status-danger/10 text-status-danger border-status-danger/20';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="p-6">
      {/* Health Advice Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold text-primary">Health Advice</h3>
          <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xs">i</span>
          </span>
        </div>
        <p className="text-sm text-metal mb-6">
          How to protect yourself from air pollution
        </p>

        {/* Precautions Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
          {precautions.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-canvas border border-mist hover:border-primary/30 transition-colors"
            >
              <img
                src={item.icon}
                alt={item.label}
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain mb-3"
              />
              <span className="text-ink font-medium text-sm text-center">
                {item.label}
              </span>
              <span className="text-metal text-xs mt-1">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Air Quality Forecast Section */}
      <div>
        <div className="bg-primary text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 mb-6">
          <span>🤖</span>
          <span className="font-medium">ML-Powered Air Quality Forecast</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {next3Dates.map((date, index) => (
            <div key={index} className="text-center">
              {aqiData && aqiData.map((day, dataIndex) => (
                <div key={dataIndex} className="flex flex-col items-center gap-3">
                  <span className="text-metal text-sm font-medium">{date}</span>
                  <div className={`w-full py-4 px-3 rounded-xl border ${getAqiColor(day[`Day${index + 1}`])}`}>
                    <h2 className="text-2xl lg:text-3xl font-bold">
                      {day[`Day${index + 1}`]}
                    </h2>
                    <span className="text-xs opacity-70 mt-1 block">AQI Index</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Component4;