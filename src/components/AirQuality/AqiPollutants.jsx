/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUrl } from "../Connectivity/storageHelper";

/**
 * Smart City Glass & Grid Design System - Air Pollutants Card
 * Premium Dashboard Style
 */
const Component2 = ({ selectedSearch, onData }) => {
  const [pollution, setPollution] = useState([]);

  useEffect(() => {
    getPollutionData();
  }, [selectedSearch]);

  const getPollutionData = async () => {
    try {
      const apiurl = getUrl();
      const response = await fetch(apiurl);
      const data = await response.json();
      setPollution(data);
      onData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Get color based on pollutant value
  const getPollutantStatus = (key, value) => {
    const thresholds = {
      PM25: { good: 30, moderate: 60, poor: 90 },
      PM10: { good: 50, moderate: 100, poor: 250 },
      SO2: { good: 40, moderate: 80, poor: 380 },
      CO: { good: 1, moderate: 2, poor: 10 },
      OZONE: { good: 50, moderate: 100, poor: 168 },
      NO2: { good: 40, moderate: 80, poor: 180 },
    };
    
    const t = thresholds[key] || { good: 50, moderate: 100, poor: 200 };
    if (value <= t.good) return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (value <= t.moderate) return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (value <= t.poor) return { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
  };

  // Pollutant data structure with colors
  const pollutants = [
    { key: 'PM25', label: 'PM2.5', icon: '/pm2.5-icon.webp', unit: 'µg/m³', emoji: '🌫️' },
    { key: 'PM10', label: 'PM10', icon: '/pm10-icon.webp', unit: 'µg/m³', emoji: '💨' },
    { key: 'SO2', label: 'SO₂', icon: '/so2.webp', unit: 'ppb', emoji: '🔶' },
    { key: 'CO', label: 'CO', icon: '/CO.webp', unit: 'ppm', emoji: '⚫' },
    { key: 'OZONE', label: 'O₃', icon: '/o3.webp', unit: 'ppb', emoji: '🟢' },
    { key: 'NO2', label: 'NO₂', icon: '/no2.webp', unit: 'ppb', emoji: '🟤' },
  ];

  return (
    <div className="h-full min-h-[320px] flex flex-col p-5">
      {/* Header */}
      <div className="mb-4">
        {pollution.map((pol) => (
          <div key={pol.id}>
            <h3 className="text-lg font-bold text-gray-900">
              Air Pollutants
            </h3>
            <p className="text-gray-500 text-sm">{pol.City}, {pol.State}</p>
          </div>
        ))}
      </div>
      
      {/* Pollutants Grid */}
      <div className="grid grid-cols-3 gap-2.5 flex-1">
        {pollutants.map((pollutant, index) => {
          const value = pollution[0]?.[pollutant.key] || 0;
          const status = getPollutantStatus(pollutant.key, value);
          
          return (
            <motion.div 
              key={pollutant.key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl ${status.bg} border ${status.border} hover:shadow-md transition-all cursor-default`}
            >
              <img 
                src={pollutant.icon} 
                alt={pollutant.label}
                className="w-8 h-8 object-contain mb-1.5"
              />
              <p className={`text-2xl font-black ${status.color}`}>
                {value}
              </p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-0.5">
                {pollutant.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Component2;
