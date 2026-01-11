import React from "react";
import MetricCard from "./MetricCard";
import {
    kelvinToCelsius,
    kelvinToFahrenheit,
    formatTime,
    getVisibilityDescription,
    getHumidityDescription,
    getFeelsLikeDescription,
    getWindDescription,
} from "../utils";

const WeatherDetailsGrid = ({ weatherData, unit }) => {
    if (!weatherData) {
        return (
            <div className="wd-card">
                <div className="wd-details-grid">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="wd-metric-card">
                            <div className="wd-skeleton" style={{ height: "80px" }}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const temp = weatherData.main.temp;
    const feelsLike = weatherData.main.feels_like;
    const feelsLikeTemp =
        unit === "C"
            ? kelvinToCelsius(feelsLike)
            : kelvinToFahrenheit(feelsLike);

    const sunrise = formatTime(weatherData.sys.sunrise, weatherData.timezone);
    const sunset = formatTime(weatherData.sys.sunset, weatherData.timezone);
    const visibility = weatherData.visibility;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;

    const metrics = [
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
            ),
            label: "Sunrise",
            value: sunrise,
            description: null,
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 10V2M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M16 18a4 4 0 00-8 0" />
                </svg>
            ),
            label: "Sunset",
            value: sunset,
            description: null,
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 4v10.54a4 4 0 11-4 0V4a2 2 0 014 0z" />
                </svg>
            ),
            label: "Feels like",
            value: `${feelsLikeTemp}°`,
            description: getFeelsLikeDescription(
                kelvinToCelsius(temp),
                kelvinToCelsius(feelsLike)
            ),
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                </svg>
            ),
            label: "Wind Status",
            value: `${windSpeed} m/s`,
            description: getWindDescription(windSpeed),
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="4" />
                    <line x1="21.17" y1="8" x2="12" y2="8" />
                    <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
                    <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
                </svg>
            ),
            label: "Visibility",
            value: `${(visibility / 1000).toFixed(1)} km`,
            description: getVisibilityDescription(visibility),
        },
        {
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
                </svg>
            ),
            label: "Humidity",
            value: `${humidity} %`,
            description: getHumidityDescription(humidity),
        },
    ];

    return (
        <div className="wd-card">
            <div className="wd-details-grid">
                {metrics.map((metric, index) => (
                    <MetricCard
                        key={index}
                        icon={metric.icon}
                        label={metric.label}
                        value={metric.value}
                        description={metric.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default WeatherDetailsGrid;
