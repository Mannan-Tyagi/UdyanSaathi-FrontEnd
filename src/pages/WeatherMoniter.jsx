import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/navbar/navbar";
import { WeatherDashboard } from "../components/WeatherDashboard";

const WeatherMoniter = () => {
  // Dummy handler for navbar (weather page doesn't need station search)
  const handleSearchSelected = () => { };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Navbar onSearchSelected={handleSearchSelected} />

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <span className="text-4xl">🌤️</span>
            Weather Monitoring
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time weather data and forecasts for your location
          </p>
        </motion.div>
      </div>

      {/* Weather Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <WeatherDashboard />
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8"
      >
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Data
            </span>
            <span>🌡️ OpenWeatherMap</span>
            <span>📊 Real-time Updates</span>
            <span>🗺️ Interactive Maps</span>
          </div>
          <p className="text-gray-400 text-xs mt-4 text-center">
            © 2025 UdyanSaathi • Environmental Intelligence Platform
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default WeatherMoniter;
