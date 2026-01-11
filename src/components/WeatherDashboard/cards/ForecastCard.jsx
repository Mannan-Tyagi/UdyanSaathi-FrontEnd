import React, { useState } from "react";
import { CityTabs, DayCard } from "../ui";
import { kelvinToCelsius, kelvinToFahrenheit, getDayName, getDayNumber } from "../utils";
import { DEFAULT_CITIES } from "../constants";

const ForecastCard = ({ forecastData, unit, onCityChange }) => {
    const [activeCity, setActiveCity] = useState(DEFAULT_CITIES[0].name);
    const [activeDay, setActiveDay] = useState(0);

    const handleCityChange = (city) => {
        setActiveCity(city.name);
        if (onCityChange) {
            onCityChange(city.lat, city.lon);
        }
    };

    const handleAddCity = () => {
        // Future: Open modal to search/add city
        console.log("Add city clicked");
    };

    // Process forecast data to get daily forecasts (one per day at noon)
    const getDailyForecasts = () => {
        if (!forecastData?.list) return [];

        const dailyMap = new Map();

        forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dateKey = date.toDateString();
            const hour = date.getHours();

            // Get the forecast closest to noon for each day
            if (!dailyMap.has(dateKey) || Math.abs(hour - 12) < Math.abs(new Date(dailyMap.get(dateKey).dt * 1000).getHours() - 12)) {
                dailyMap.set(dateKey, item);
            }
        });

        return Array.from(dailyMap.values()).slice(0, 7);
    };

    const dailyForecasts = getDailyForecasts();

    if (!forecastData) {
        return (
            <div className="wd-card wd-forecast">
                <div className="wd-loading">
                    <div className="wd-spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="wd-card wd-forecast">
            {/* Header */}
            <div className="wd-forecast-header">
                <h3 className="wd-card-title">Forecast</h3>
                <div className="wd-card-actions">
                    <button className="wd-icon-btn" title="Download">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="7,10 12,15 17,10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                    </button>
                    <button className="wd-icon-btn" title="More options">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <circle cx="12" cy="6" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="12" cy="18" r="2" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* City Tabs */}
            <CityTabs
                cities={DEFAULT_CITIES}
                activeCity={activeCity}
                onCityChange={handleCityChange}
                onAddCity={handleAddCity}
            />

            {/* Day Cards */}
            <div className="wd-forecast-days">
                {dailyForecasts.map((forecast, index) => {
                    const temp =
                        unit === "C"
                            ? kelvinToCelsius(forecast.main.temp)
                            : kelvinToFahrenheit(forecast.main.temp);

                    return (
                        <DayCard
                            key={forecast.dt}
                            day={getDayName(forecast.dt)}
                            date={getDayNumber(forecast.dt)}
                            icon={forecast.weather[0].icon}
                            temp={`${temp}°${unit}`}
                            isActive={index === activeDay}
                            onClick={() => setActiveDay(index)}
                        />
                    );
                })}

                {/* Navigation Arrow */}
                <button
                    className="wd-day-card"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "48px",
                    }}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ForecastCard;
