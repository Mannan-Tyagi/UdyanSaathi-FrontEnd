import React from "react";
import Navbar from "../components/navbar/navbar(Weather)";
import WeatherComponent1 from "../components/WeatherMonitoring/WeatherComponent1";
import WeatherComponent2 from "../components/WeatherMonitoring/WeatherComponent2";
import WeatherComponent3 from "../components/WeatherMonitoring/WeatherComponent3";
import WeatherComponent4 from "../components/WeatherMonitoring/WeatherComponent4";

/**
 * Smart City Glass & Grid Design System - Weather Monitoring Page
 */
const WeatherMoniter = () => {
  return (
    <div className="min-h-screen bg-canvas page-gradient">
      <Navbar />
      
      {/* Main Content - Bento Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-6">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">Weather Monitoring</h1>
          <p className="text-metal mt-1">Real-time weather data and forecasts</p>
        </div>

        {/* Weather Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <WeatherComponent1 />
          <div className="lg:col-span-2">
            <WeatherComponent2 />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <WeatherComponent3 />
          <div className="lg:col-span-2">
            <WeatherComponent4 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMoniter;
