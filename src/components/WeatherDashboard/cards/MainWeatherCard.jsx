import React from "react";
import { LocationBadge, UnitToggle, WeatherIcon } from "../ui";
import { kelvinToCelsius, kelvinToFahrenheit } from "../utils";

const MainWeatherCard = ({ weatherData, unit, onUnitToggle }) => {
    if (!weatherData) {
        return (
            <div className="wd-card wd-main-weather">
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

    return (
        <div className="wd-card wd-main-weather">
            {/* Top Row */}
            <div className="wd-main-weather-top">
                <LocationBadge
                    city={weatherData.name}
                    country={weatherData.sys?.country}
                />
                <UnitToggle unit={unit} onToggle={onUnitToggle} />
            </div>

            {/* Weather Content */}
            <div className="wd-weather-content">
                <div className="wd-temperature">
                    {temp}°{unit}
                </div>
                <div className="wd-condition">{condition.main}</div>
                <div className="wd-high-low">
                    High: {tempMax}° Low: {tempMin}°
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
