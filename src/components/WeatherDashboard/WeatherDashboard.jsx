import React from "react";
import { motion } from "framer-motion";
import "./WeatherDashboard.css";

// Card components
import {
    MainWeatherCard,
    ForecastCard,
    WeatherDetailsGrid,
    WindSpeedCard,
} from "./cards";

// Chart components
import { AirQualityChart, ChanceOfRainChart, UVIndexChart } from "./charts";

// Hooks
import { useWeatherData, useTemperatureUnit } from "./hooks";

const WeatherDashboard = () => {
    const {
        weatherData,
        forecastData,
        airQualityData,
        location,
        isLoading,
        error,
        updateLocation,
        refresh,
    } = useWeatherData();

    const { unit, toggleUnit } = useTemperatureUnit("C");

    const handleCityChange = (lat, lon) => {
        updateLocation(lat, lon);
    };

    if (error) {
        return (
            <div className="wd-dashboard-wrapper">
                <div className="wd-main-content">
                    <div className="wd-error-container">
                        <div className="wd-error-card">
                            <div className="wd-error-icon">⚠️</div>
                            <h2>Error Loading Weather Data</h2>
                            <p>{error}</p>
                            <button className="wd-retry-btn" onClick={refresh}>
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wd-dashboard-wrapper">
            <main className="wd-main-content">
                <div className="wd-content">
            {/* Row 1: Main Weather + Forecast */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="wd-row wd-row-1"
            >
                <MainWeatherCard
                    weatherData={weatherData}
                    unit={unit}
                    onUnitToggle={toggleUnit}
                />
                <ForecastCard
                    forecastData={forecastData}
                    unit={unit}
                    onCityChange={handleCityChange}
                />
            </motion.div>

            {/* Row 2: Weather Details + Wind Speed */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="wd-row wd-row-2"
            >
                <WeatherDetailsGrid weatherData={weatherData} unit={unit} />
                <WindSpeedCard weatherData={weatherData} location={location} />
            </motion.div>

            {/* Row 3: Charts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="wd-row wd-row-3"
            >
                <AirQualityChart data={null} />
                <ChanceOfRainChart data={null} />
                <UVIndexChart data={null} />
                </motion.div>
                </div>
            </main>
        </div>
    );
};

export default WeatherDashboard;
