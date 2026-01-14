import React, { useEffect, useState } from "react";
import { getBaseUrl, getStationName, getTodayDate } from "../Connectivity/storageHelper";

/**
 * Health Advice & ML Forecast - Compact Design
 */
const Component4 = (selectedSearch) => {
  const [aqiData, setAqiData] = useState(null);
  const [next3Dates, setNext3Dates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPollutionData();
    generateNext3Dates();
  }, [selectedSearch]);

  const generateNext3Dates = () => {
    try {
      const todaydate = getTodayDate();
      if (!todaydate) throw new Error("Today's date is invalid");
      
      const dateWithoutTime = todaydate.split(" ")[0];
      const startDate = new Date(dateWithoutTime);
      const upcomingDates = [];

      for (let i = 1; i < 4; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        const options = { day: 'numeric', month: 'short' };
        upcomingDates.push(currentDate.toLocaleString('en-US', options));
      }

      setNext3Dates(upcomingDates);
    } catch (error) {
      console.error("Error generating dates:", error.message);
    }
  };

  const getPollutionData = async () => {
    setIsLoading(true);
    try {
      const selectstation = getStationName();
      const baseurl = getBaseUrl();
      const response = await fetch(`${baseurl}get-MLData/?pol_Station=${selectstation}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setAqiData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const precautions = [
    { icon: '/precautions/wear-mask-icon.webp', label: 'Wear Mask', status: 'Required', color: 'text-status-critical' },
    { icon: '/precautions/Stay-Indoors-icon.webp', label: 'Stay Indoor', status: 'Recommended', color: 'text-status-moderate' },
    { icon: '/precautions/Shut-Openings-icon-cross.webp', label: 'Close Windows', status: 'Required', color: 'text-status-critical' },
    { icon: '/precautions/Use-a-purifier-icon.webp', label: 'Use Purifier', status: 'Helpful', color: 'text-primary' },
    { icon: '/precautions/family-icon-cross.webp', label: 'Limit Outdoor', status: 'Advised', color: 'text-status-moderate' },
  ];

  const getAqiColor = (value) => {
    if (value <= 50) return 'bg-status-good/10 text-status-good border-status-good/30';
    if (value <= 100) return 'bg-aqi-moderate/15 text-aqi-moderate border-aqi-moderate/30';
    if (value <= 200) return 'bg-status-moderate/15 text-status-moderate border-status-moderate/30';
    return 'bg-status-critical/10 text-status-critical border-status-critical/30';
  };

  const getAqiLabel = (value) => {
    if (value <= 50) return 'Good';
    if (value <= 100) return 'Moderate';
    if (value <= 200) return 'Poor';
    return 'Severe';
  };

  return (
    <div className="space-y-5">
      {/* Health Precautions Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-ink">Health Precautions</h4>
          <span className="text-[10px] text-metal bg-canvas px-2 py-1 rounded-full border border-mist">Based on current AQI</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {precautions.map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center p-2.5 rounded-xl bg-canvas/50 border border-mist hover:border-primary/30 hover:bg-white transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-lg border border-mist flex items-center justify-center mb-1.5 group-hover:shadow-soft-xs transition-shadow">
                <img
                  src={item.icon}
                  alt={item.label}
                  className="w-6 h-6 object-contain opacity-75 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <span className="text-[11px] text-ink font-medium text-center leading-tight">
                {item.label}
              </span>
              <span className={`text-[9px] mt-0.5 font-medium ${item.color}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ML Forecast Section */}
      <div>
        <div className="bg-gradient-to-r from-primary to-primary-600 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 mb-3">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-sm font-medium">ML-Powered 3-Day Forecast</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 w-12 bg-mist rounded mb-2 mx-auto"></div>
                <div className="h-24 bg-mist rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {next3Dates.map((date, index) => (
              <div key={index} className="text-center">
                <span className="text-[11px] text-metal font-medium block mb-2">{date}</span>
                {aqiData && aqiData.map((day, dataIndex) => {
                  const aqiValue = day[`Day${index + 1}`];
                  return (
                    <div 
                      key={dataIndex} 
                      className={`py-5 px-3 rounded-xl border-2 ${getAqiColor(aqiValue)}`}
                    >
                      <div className="text-3xl font-bold tabular-nums leading-none">
                        {Math.round(aqiValue)}
                      </div>
                      <span className="text-[10px] opacity-60 block mt-1">AQI</span>
                      <span className="text-[9px] font-semibold mt-1.5 inline-block px-2 py-0.5 rounded-full bg-white/60">
                        {getAqiLabel(aqiValue)}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend Row - Compact */}
      <div className="flex items-center justify-between pt-3 border-t border-mist">
        <div className="flex items-center gap-3 text-[10px] text-metal">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-good"></span>
            Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-aqi-moderate"></span>
            Moderate
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-moderate"></span>
            Poor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-status-critical"></span>
            Severe
          </span>
        </div>
        <span className="text-[9px] text-muted">Updated hourly</span>
      </div>
    </div>
  );
};

export default Component4;