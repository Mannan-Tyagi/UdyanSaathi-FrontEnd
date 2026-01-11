import React from "react";

const WeatherIcon = ({ condition, size = 64, className = "" }) => {
    // Map OpenWeatherMap icons to SVG representations
    const getIcon = () => {
        switch (condition) {
            case "01d": // Clear sky day
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="14" fill="#FCD34D" />
                        <g stroke="#FCD34D" strokeWidth="3" strokeLinecap="round">
                            <line x1="32" y1="4" x2="32" y2="12" />
                            <line x1="32" y1="52" x2="32" y2="60" />
                            <line x1="4" y1="32" x2="12" y2="32" />
                            <line x1="52" y1="32" x2="60" y2="32" />
                            <line x1="12.2" y1="12.2" x2="17.9" y2="17.9" />
                            <line x1="46.1" y1="46.1" x2="51.8" y2="51.8" />
                            <line x1="12.2" y1="51.8" x2="17.9" y2="46.1" />
                            <line x1="46.1" y1="17.9" x2="51.8" y2="12.2" />
                        </g>
                    </svg>
                );

            case "01n": // Clear sky night
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <path
                            d="M32 48c-8.8 0-16-7.2-16-16s7.2-16 16-16c0.9 0 1.7 0.1 2.6 0.2-3.1 2.9-5 7-5 11.5 0 8.8 7.2 16 16 16-0.3 0-0.6 0-0.9 0-4.1 2.7-9 4.3-12.7 4.3z"
                            fill="#CBD5E1"
                        />
                    </svg>
                );

            case "02d": // Few clouds day
            case "03d": // Scattered clouds
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <circle cx="24" cy="24" r="10" fill="#FCD34D" />
                        <g stroke="#FCD34D" strokeWidth="2" strokeLinecap="round">
                            <line x1="24" y1="6" x2="24" y2="10" />
                            <line x1="10" y1="24" x2="6" y2="24" />
                            <line x1="12.6" y1="12.6" x2="15.4" y2="15.4" />
                        </g>
                        <path
                            d="M48 54H20c-5.5 0-10-4.5-10-10s4.5-10 10-10c0.8-4.7 4.9-8.3 9.9-8.3 4.1 0 7.7 2.5 9.2 6.1 1.1-0.5 2.3-0.8 3.6-0.8 4.4 0 8 3.6 8 8 0 0.3 0 0.5-0.1 0.8 4 0.9 7 4.5 7 8.7 0 5-4 9.5-9.6 9.5z"
                            fill="#E2E8F0"
                        />
                    </svg>
                );

            case "02n":
            case "03n":
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <path
                            d="M18 20c-4.4 0-8-3.6-8-8s3.6-8 8-8c0.5 0 0.9 0 1.3 0.1-1.6 1.5-2.5 3.5-2.5 5.8 0 4.4 3.6 8 8 8-0.1 0-0.3 0-0.5 0-2 1.4-4.5 2.1-6.3 2.1z"
                            fill="#CBD5E1"
                        />
                        <path
                            d="M48 54H20c-5.5 0-10-4.5-10-10s4.5-10 10-10c0.8-4.7 4.9-8.3 9.9-8.3 4.1 0 7.7 2.5 9.2 6.1 1.1-0.5 2.3-0.8 3.6-0.8 4.4 0 8 3.6 8 8 0 0.3 0 0.5-0.1 0.8 4 0.9 7 4.5 7 8.7 0 5-4 9.5-9.6 9.5z"
                            fill="#94A3B8"
                        />
                    </svg>
                );

            case "04d": // Broken clouds
            case "04n":
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <path
                            d="M52 44H16c-6.6 0-12-5.4-12-12s5.4-12 12-12c1-5.6 5.9-10 11.9-10 4.9 0 9.2 3 11 7.3 1.3-0.6 2.8-1 4.3-1 5.3 0 9.6 4.3 9.6 9.6 0 0.4 0 0.6-0.1 1 4.8 1.1 8.4 5.4 8.4 10.4 0 6-4.8 11.4-11.5 11.4z"
                            fill="#94A3B8"
                        />
                        <path
                            d="M44 54H20c-5.5 0-10-4.5-10-10s4.5-10 10-10c0.8-4.7 4.9-8.3 9.9-8.3 4.1 0 7.7 2.5 9.2 6.1 1.1-0.5 2.3-0.8 3.6-0.8 4.4 0 8 3.6 8 8 0 0.3 0 0.5-0.1 0.8 4 0.9 7 4.5 7 8.7 0 5-4 9.5-9.6 9.5H44z"
                            fill="#CBD5E1"
                        />
                    </svg>
                );

            case "09d": // Shower rain
            case "09n":
            case "10d": // Rain
            case "10n":
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <path
                            d="M48 36H20c-5.5 0-10-4.5-10-10s4.5-10 10-10c0.8-4.7 4.9-8.3 9.9-8.3 4.1 0 7.7 2.5 9.2 6.1 1.1-0.5 2.3-0.8 3.6-0.8 4.4 0 8 3.6 8 8 0 0.3 0 0.5-0.1 0.8 4 0.9 7 4.5 7 8.7 0 5-4 9.5-9.6 9.5z"
                            fill="#94A3B8"
                        />
                        <g stroke="#60A5FA" strokeWidth="2" strokeLinecap="round">
                            <line x1="20" y1="42" x2="18" y2="50" />
                            <line x1="28" y1="42" x2="26" y2="54" />
                            <line x1="36" y1="42" x2="34" y2="50" />
                            <line x1="44" y1="42" x2="42" y2="54" />
                        </g>
                    </svg>
                );

            case "11d": // Thunderstorm
            case "11n":
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <path
                            d="M48 32H20c-5.5 0-10-4.5-10-10s4.5-10 10-10c0.8-4.7 4.9-8.3 9.9-8.3 4.1 0 7.7 2.5 9.2 6.1 1.1-0.5 2.3-0.8 3.6-0.8 4.4 0 8 3.6 8 8 0 0.3 0 0.5-0.1 0.8 4 0.9 7 4.5 7 8.7 0 5-4 9.5-9.6 9.5z"
                            fill="#64748B"
                        />
                        <path
                            d="M36 34l-6 12h8l-4 14 12-16h-8l4-10h-6z"
                            fill="#FCD34D"
                        />
                    </svg>
                );

            case "13d": // Snow
            case "13n":
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <path
                            d="M48 36H20c-5.5 0-10-4.5-10-10s4.5-10 10-10c0.8-4.7 4.9-8.3 9.9-8.3 4.1 0 7.7 2.5 9.2 6.1 1.1-0.5 2.3-0.8 3.6-0.8 4.4 0 8 3.6 8 8 0 0.3 0 0.5-0.1 0.8 4 0.9 7 4.5 7 8.7 0 5-4 9.5-9.6 9.5z"
                            fill="#CBD5E1"
                        />
                        <g fill="#BFDBFE">
                            <circle cx="20" cy="48" r="3" />
                            <circle cx="32" cy="52" r="3" />
                            <circle cx="44" cy="46" r="3" />
                            <circle cx="26" cy="56" r="2" />
                            <circle cx="38" cy="58" r="2" />
                        </g>
                    </svg>
                );

            case "50d": // Mist
            case "50n":
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <g stroke="#94A3B8" strokeWidth="3" strokeLinecap="round">
                            <line x1="8" y1="20" x2="56" y2="20" />
                            <line x1="12" y1="28" x2="52" y2="28" />
                            <line x1="8" y1="36" x2="56" y2="36" />
                            <line x1="12" y1="44" x2="52" y2="44" />
                        </g>
                    </svg>
                );

            default: // Default sunny
                return (
                    <svg viewBox="0 0 64 64" fill="none">
                        <circle cx="32" cy="32" r="14" fill="#FCD34D" />
                        <g stroke="#FCD34D" strokeWidth="3" strokeLinecap="round">
                            <line x1="32" y1="4" x2="32" y2="12" />
                            <line x1="32" y1="52" x2="32" y2="60" />
                            <line x1="4" y1="32" x2="12" y2="32" />
                            <line x1="52" y1="32" x2="60" y2="32" />
                        </g>
                    </svg>
                );
        }
    };

    return (
        <div
            className={`wd-weather-icon ${className}`}
            style={{ width: size, height: size }}
        >
            {getIcon()}
        </div>
    );
};

export default WeatherIcon;
