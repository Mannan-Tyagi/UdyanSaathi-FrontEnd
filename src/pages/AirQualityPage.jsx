/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar/navbar';
import AqiDetails from "../components/AirQuality/AqiDetails";
import Component2 from "../components/AirQuality/AqiPollutants";
import Component3 from "../components/AirQuality/MostPollutedCities";
import Component4 from "../components/AirQuality/HealthAndMl";
import Component5 from "../components/AirQuality/LeastPollutedCities"; 
import Component6 from "../components/AirQuality/CompareDataGraph";
import Component7 from "../components/AirQuality/MetroCitiesDetails";
import Component8 from "../components/AirQuality/AqiHeatMap";
import Map from "../components/AirQuality/Map";
import HealthImpact from "../components/AirQuality/HealthImpact";
import { setStationName } from '../components/Connectivity/storageHelper';

/**
 * Smart City Glass & Grid Design System - Air Quality Page
 * Bento Grid Layout with consistent card styling
 */
function AirQualityPage() {
  const [selectedSearch, setSelectedSearch] = useState('');
  const [dangerAlert, setDangerAlert] = useState(null);

  const handleSearchSelected = (search) => {
    setSelectedSearch(search);
    setStationName(search);
  };

  const [childData, setChildData] = useState(null);

  const handleChildData = (data) => {
    checkPollutionConditions(data);
    setChildData(data);
  };

  // WHO/CPCB based danger thresholds (synchronized with ward comparison standards)
  const checkPollutionConditions = (data) => {
    const { OZONE, CO, PM10, PM25, NO2, SO2 } = data[0];
    let maxPollutant = null;

    if (OZONE > 168) {
      maxPollutant = {
        level: "Danger",
        message: "Ozone levels are unhealthy. Possible causes: High UV + VOCs from traffic/industry.",
        chemical: "Ozone (O₃)",
        amount: OZONE,
      };
    }
    if (CO > 10) {
      maxPollutant = {
        level: "Danger",
        message: "Carbon monoxide from vehicle emissions is dangerously high.",
        chemical: "Carbon Monoxide (CO)",
        amount: CO,
      };
    }
    if (PM10 > 250 || PM25 > 90) {
      const maxPM = PM10 > PM25 ? PM10 : PM25;
      maxPollutant = {
        level: "Danger",
        message: PM25 > 90 ? "Fine particulate matter (PM2.5) at hazardous levels. Sources: vehicles, construction, biomass burning." : "Coarse dust (PM10) pollution. Sources: road dust, construction activities.",
        chemical: `Particulate Matter (${maxPM === PM10 ? "PM10" : "PM2.5"})`,
        amount: maxPM,
      };
    }
    if (NO2 > 180) {
      maxPollutant = {
        level: "Danger",
        message: "Nitrogen dioxide from vehicle emissions and industrial activity is very high.",
        chemical: "Nitrogen Dioxide (NO₂)",
        amount: NO2,
      };
    }
    if (SO2 > 380) {
      maxPollutant = {
        level: "Danger",
        message: "Sulfur dioxide from fossil fuel combustion and industrial processes exceeds safe limits.",
        chemical: "Sulfur Dioxide (SO₂)",
        amount: SO2,
      };
    }

    if (maxPollutant) {
      setDangerAlert(maxPollutant);
    } else {
      setDangerAlert(null);
    }
  };

  return (
    <div className="min-h-screen bg-canvas page-gradient" style={{ position: 'relative' }}>
      <Navbar onSearchSelected={handleSearchSelected} />

      {/* Floating Danger Alert - Bottom Toast Style */}
      <AnimatePresence>
        {dangerAlert && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg"
          >
            <div className="bg-white rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                {/* Alert Icon */}
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-white text-xl">⚠️</span>
                </div>
                
                {/* Alert Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-red-600 font-bold text-sm">{dangerAlert.level} Alert</span>
                    <span className="text-red-500 font-black text-lg">{dangerAlert.amount}</span>
                    <span className="text-gray-400 text-xs">{dangerAlert.chemical}</span>
                  </div>
                  <p className="text-gray-600 text-xs truncate">{dangerAlert.message}</p>
                </div>
                
                {/* Close Button */}
                <button 
                  onClick={() => setDangerAlert(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Progress bar animation */}
              <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
                className="h-1 bg-gradient-to-r from-red-500 to-rose-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Full Width Bento Grid */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pb-10 pt-2">

        {/* AQI Details & Pollutants - Two Column Bento Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4"
        >
          <div className="lg:col-span-3 bento-card">
            <AqiDetails selectedSearch={selectedSearch} />
          </div>
          <div className="lg:col-span-2 bento-card">
            <Component2 selectedSearch={selectedSearch} onData={handleChildData} />
          </div>
        </motion.div>

        {/* Health Impact */}
        {childData && childData.length > 0 && childData[0]?.PM25 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <HealthImpact pm25={childData[0].PM25} />
          </motion.div>
        )}
        
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4"
        >
          <div className="bento-card p-0 overflow-hidden">
            <Map selectedSearch={selectedSearch} />
          </div>
        </motion.div>

        {/* Most Polluted & Health/ML */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
        >
          <div className="bento-card">
            <Component3 />
          </div>
          <div className="lg:col-span-2 bento-card">
            <Component4 />
          </div>
        </motion.div>

        {/* Least Polluted & Compare Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4"
        >
          <div className="bento-card">
            <Component5 />
          </div>
          <div className="lg:col-span-2 bento-card">
            <Component6 />
          </div>
        </motion.div>

        {/* Metro Cities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <div className="bento-card">
            <Component7 />
          </div>
        </motion.div>

        {/* Heat Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-4"
        >
          <div className="bento-card p-0 overflow-hidden">
            <Component8 selectedSearch={selectedSearch} />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <div className="bento-card text-center py-3">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              <span className="flex items-center gap-2 text-metal">
                <span className="w-2 h-2 bg-status-safe rounded-full animate-pulse" />
                Live Data
              </span>
              <span className="text-metal">🛰️ Sentinel-5P</span>
              <span className="text-metal">📊 CPCB Data</span>
              <span className="text-metal">🤖 ML Powered</span>
            </div>
            <p className="text-metal/60 text-xs mt-2">
              © 2025 UdyanSaathi • Environmental Intelligence Platform
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default AirQualityPage;
