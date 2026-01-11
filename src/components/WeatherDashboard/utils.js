// Weather Dashboard Utilities

/**
 * Convert Kelvin to Celsius
 */
export const kelvinToCelsius = (kelvin) => {
    return Math.round(kelvin - 273.15);
};

/**
 * Convert Kelvin to Fahrenheit
 */
export const kelvinToFahrenheit = (kelvin) => {
    return Math.round(((kelvin - 273.15) * 9) / 5 + 32);
};

/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
    return Math.round((celsius * 9) / 5 + 32);
};

/**
 * Format temperature with unit
 */
export const formatTemperature = (kelvin, unit = "C") => {
    if (unit === "F") {
        return `${kelvinToFahrenheit(kelvin)}°F`;
    }
    return `${kelvinToCelsius(kelvin)}°C`;
};

/**
 * Format time from Unix timestamp
 */
export const formatTime = (timestamp, timezone = 0) => {
    const date = new Date((timestamp + timezone) * 1000);
    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    });
};

/**
 * Format date from Unix timestamp
 */
export const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

/**
 * Get day name from Unix timestamp
 */
export const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Get day number from Unix timestamp
 */
export const getDayNumber = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.getDate();
};

/**
 * Get wind direction label from degrees
 */
export const getWindDirection = (degrees) => {
    const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
};

/**
 * Get wind description based on speed (m/s)
 */
export const getWindDescription = (speed) => {
    if (speed < 0.5) return "Calm";
    if (speed < 1.5) return "Light air";
    if (speed < 3.3) return "Light breeze";
    if (speed < 5.5) return "Gentle breeze";
    if (speed < 7.9) return "Moderate breeze";
    if (speed < 10.7) return "Fresh breeze";
    if (speed < 13.8) return "Strong breeze";
    if (speed < 17.1) return "Near gale";
    if (speed < 20.7) return "Gale";
    if (speed < 24.4) return "Strong gale";
    return "Storm";
};

/**
 * Get visibility description
 */
export const getVisibilityDescription = (meters) => {
    const km = meters / 1000;
    if (km >= 10) return "Excellent visibility";
    if (km >= 5) return "Good visibility";
    if (km >= 2) return "Moderate visibility";
    if (km >= 1) return "Poor visibility";
    return "Very poor visibility";
};

/**
 * Get humidity description
 */
export const getHumidityDescription = (humidity) => {
    if (humidity < 30) return "Dry";
    if (humidity < 60) return "Comfortable";
    if (humidity < 80) return "Humid";
    return "Very humid";
};

/**
 * Get feels like description
 */
export const getFeelsLikeDescription = (actual, feelsLike) => {
    const diff = feelsLike - actual;
    if (Math.abs(diff) < 2) return "Feels accurate";
    if (diff > 0) return "Feels warmer than actual";
    return "Wind is making it feel cooler";
};

/**
 * Get UV Index level
 */
export const getUVLevel = (uvi) => {
    if (uvi <= 2) return { level: "Low", color: "#4ade80" };
    if (uvi <= 5) return { level: "Moderate", color: "#facc15" };
    if (uvi <= 7) return { level: "High", color: "#fb923c" };
    if (uvi <= 10) return { level: "Very High", color: "#ef4444" };
    return { level: "Extreme", color: "#a855f7" };
};

/**
 * Get AQI level
 */
export const getAQILevel = (aqi) => {
    if (aqi <= 50) return { level: "Good", color: "#4ade80" };
    if (aqi <= 100) return { level: "Satisfactory", color: "#a3e635" };
    if (aqi <= 200) return { level: "Moderate", color: "#facc15" };
    if (aqi <= 300) return { level: "Poor", color: "#fb923c" };
    if (aqi <= 400) return { level: "Very Poor", color: "#ef4444" };
    return { level: "Severe", color: "#7f1d1d" };
};

/**
 * Generate mock chart data for demo purposes
 */
export const generateMockChartData = (days = 7, minVal = 10, maxVal = 50) => {
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const today = new Date().getDay();

    return Array.from({ length: days }, (_, i) => ({
        day: dayNames[(today + i) % 7],
        value: Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal,
    }));
};
