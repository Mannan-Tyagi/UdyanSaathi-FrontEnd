import React from "react";
import { LocationBadge, UnitToggle, WeatherIcon } from "../ui";
import { kelvinToCelsius, kelvinToFahrenheit, formatTime } from "../utils";

// Weather condition to background mapping
const getWeatherBackground = (condition) => {
    const backgrounds = {
        "01d": "linear-gradient(135deg, #56CCF2 0%, #2F80ED 50%, #1E3A8A 100%)",
        "01n": "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        "02d": "linear-gradient(135deg, #74b9ff 0%, #a29bfe 50%, #6c5ce7 100%)",
        "02n": "linear-gradient(135deg, #2d3436 0%, #636e72 50%, #1e272e 100%)",
        "03d": "linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #636e72 100%)",
        "03n": "linear-gradient(135deg, #2d3436 0%, #4a5568 50%, #1a202c 100%)",
        "04d": "linear-gradient(135deg, #b2bec3 0%, #636e72 50%, #2d3436 100%)",
        "04n": "linear-gradient(135deg, #2d3436 0%, #1a202c 50%, #0d1117 100%)",
        "09d": "linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #2d3436 100%)",
        "09n": "linear-gradient(135deg, #2d3436 0%, #1e3a5f 50%, #0d1117 100%)",
        "10d": "linear-gradient(135deg, #a8d5e5 0%, #5B9BD5 50%, #2C5282 100%)",
        "10n": "linear-gradient(135deg, #1a365d 0%, #2d3748 50%, #1a202c 100%)",
        "11d": "linear-gradient(135deg, #636e72 0%, #2d3436 50%, #1a1a2e 100%)",
        "11n": "linear-gradient(135deg, #1a1a2e 0%, #0d1117 50%, #000000 100%)",
        "13d": "linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #74b9ff 100%)",
        "13n": "linear-gradient(135deg, #2d3436 0%, #4a5568 50%, #1a202c 100%)",
        "50d": "linear-gradient(135deg, #dfe6e9 0%, #b2bec3 50%, #636e72 100%)",
        "50n": "linear-gradient(135deg, #2d3436 0%, #4a5568 50%, #1a202c 100%)",
    };
    return backgrounds[condition] || "linear-gradient(135deg, #87CEEB 0%, #E0F7FA 50%, #B3E5FC 100%)";
};

const isDarkBackground = (condition) => {
    const darkConditions = ["01n", "02n", "03n", "04n", "09n", "10n", "11d", "11n", "13n", "50n"];
    return darkConditions.includes(condition);
};

const MainWeatherCard = ({ weatherData, unit, onUnitToggle }) => {
    if (!weatherData) {
        return (
            <div className="wd-card wd-main-weather wd-main-weather-loading">
                <div className="wd-loading">
                    <div className="wd-spinner"></div>
                </div>
            </div>
        );
    }

    const temp =
        unit === "C"
            ? kelvinToCelsius(weatherData.main.temp)
            : kelvinToFahrenheit(weatherData.main.temp);

    const tempMax =
        unit === "C"
            ? kelvinToCelsius(weatherData.main.temp_max)
            : kelvinToFahrenheit(weatherData.main.temp_max);

    const tempMin =
        unit === "C"
            ? kelvinToCelsius(weatherData.main.temp_min)
            : kelvinToFahrenheit(weatherData.main.temp_min);

    const condition = weatherData.weather[0];
    const isDark = isDarkBackground(condition.icon);
    const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

    return (
        <div
            className={`wd-card wd-main-weather ${isDark ? "wd-dark-theme" : ""}`}
            style={{ background: getWeatherBackground(condition.icon) }}
        >
            {/* Cloud overlay for depth */}
            <div className="wd-weather-overlay" />

            {/* Top Row */}
            <div className="wd-main-weather-top">
                <LocationBadge
                    city={weatherData.name}
                    country={weatherData.sys?.country}
                    isDark={isDark}
                />
                <UnitToggle unit={unit} onToggle={onUnitToggle} isDark={isDark} />
            </div>

            {/* Weather Content */}
            <div className="wd-weather-content">
                <div className="wd-temperature-container">
                    <span className="wd-temperature">{temp}</span>
                    <span className="wd-temperature-unit">°{unit}</span>
                </div>
                <div className="wd-condition-text">{condition.main}</div>
                <div className="wd-weather-meta">
                    <span className="wd-high-low">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 19V5M5 12l7-7 7 7" />
                        </svg>
                        {tempMax}°
                    </span>
                    <span className="wd-separator">•</span>
                    <span className="wd-high-low">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12l7 7 7-7" />
                        </svg>
                        {tempMin}°
                    </span>
                    <span className="wd-separator">•</span>
                    <span className="wd-current-time">{currentTime}</span>
                </div>
            </div>

            {/* Weather Illustration */}
            <div className="wd-weather-illustration">
                <WeatherIcon condition={condition.icon} size={180} />
            </div>
        </div>
    );
};

export default MainWeatherCard;
