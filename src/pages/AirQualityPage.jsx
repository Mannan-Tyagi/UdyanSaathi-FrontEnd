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

function AirQualityPage() {
  const [selectedSearch, setSelectedSearch] = useState('');
  const [dangerAlert, setDangerAlert] = useState(null);

  const handleSearchSelected = (search) => {
    setSelectedSearch(search);
    setStationName(search);
  };

  const [childData, setChildData] = useState(null);

  const handleChildData = (data) => {
    console.log("Data received from child:", data);
    console.log("PM25 value:", data[0]?.PM25);

    checkPollutionConditions(data);
    setChildData(data);
  };

  // WHO/CPCB based danger thresholds (synchronized with ward comparison standards)
  const checkPollutionConditions = (data) => {
    const { OZONE, CO, PM10, PM25, NO2, SO2 } = data[0];
    let maxPollutant = null;

    // Ozone: WHO guideline 100 µg/m³ (8-hour), unhealthy >168
    if (OZONE > 168) {
      maxPollutant = {
        level: "Danger",
        message: "Ozone levels are unhealthy. Possible causes: High UV + VOCs from traffic/industry.",
        chemical: "Ozone (O₃)",
        amount: OZONE,
      };
    }
    // CO: WHO guideline 10 mg/m³, unhealthy >10 (likely ppm in data)
    if (CO > 10) {
      maxPollutant = {
        level: "Danger",
        message: "Carbon monoxide from vehicle emissions is dangerously high.",
        chemical: "Carbon Monoxide (CO)",
        amount: CO,
      };
    }
    // PM10: WHO 50 µg/m³, CPCB unhealthy >250
    // PM2.5: WHO 25 µg/m³, CPCB unhealthy >90
    if (PM10 > 250 || PM25 > 90) {
      const maxPM = PM10 > PM25 ? PM10 : PM25;
      maxPollutant = {
        level: "Danger",
        message: PM25 > 90 ? "Fine particulate matter (PM2.5) at hazardous levels. Sources: vehicles, construction, biomass burning." : "Coarse dust (PM10) pollution. Sources: road dust, construction activities.",
        chemical: `Particulate Matter (${maxPM === PM10 ? "PM10" : "PM2.5"})`,
        amount: maxPM,
      };
    }
    // NO2: WHO 40 µg/m³, CPCB unhealthy >180
    if (NO2 > 180) {
      maxPollutant = {
        level: "Danger",
        message: "Nitrogen dioxide from vehicle emissions and industrial activity is very high.",
        chemical: "Nitrogen Dioxide (NO₂)",
        amount: NO2,
      };
    }
    // SO2: WHO 40 µg/m³, CPCB unhealthy >380
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar onSearchSelected={handleSearchSelected} />

      {/* Danger Alert */}
      <AnimatePresence>
        {dangerAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 mt-6"
          >
            <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl p-4 shadow-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-bold text-lg">{dangerAlert.level} Alert</h4>
                  <p className="text-white/90 text-sm">{dangerAlert.message}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-xs">{dangerAlert.chemical}</p>
                  <p className="text-white font-bold text-2xl">{dangerAlert.amount}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        {/* AQI Details & Pollutants */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6"
        >
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <AqiDetails selectedSearch={selectedSearch} />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component2 selectedSearch={selectedSearch} onData={handleChildData} />
          </div>
        </motion.div>

        {/* Health Impact */}
        {childData && childData.length > 0 && childData[0]?.PM25 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <HealthImpact pm25={childData[0].PM25} />
            </div>
          </motion.div>
        )}
        
        {/* Map Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Map selectedSearch={selectedSearch} />
          </div>
        </motion.div>

        {/* Most Polluted & Health/ML */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component3 />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component4 />
          </div>
        </motion.div>

        {/* Least Polluted & Compare Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component5 />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component6 />
          </div>
        </motion.div>

        {/* Metro Cities */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component7 />
          </div>
        </motion.div>

        {/* Heat Map */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-6"
        >
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <Component8 selectedSearch={selectedSearch} />
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Live Data
              </span>
              <span>🛰️ Sentinel-5P</span>
              <span>📊 CPCB Data</span>
              <span>🤖 ML Powered</span>
            </div>
            <p className="text-gray-400 text-xs mt-4">
              © 2025 UdyanSaathi • Environmental Intelligence Platform
            </p>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default AirQualityPage;
