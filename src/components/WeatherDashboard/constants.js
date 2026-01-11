// Weather Dashboard Constants
export const WEATHER_API_KEY = "bd5e378503939ddaee76f12ad7a97608";
export const WEATHER_API_BASE = "https://api.openweathermap.org/data/2.5";

// Default cities for the forecast tabs
export const DEFAULT_CITIES = [
    { name: "New York", lat: 40.7128, lon: -74.006 },
    { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
    { name: "Chicago", lat: 41.8781, lon: -87.6298 },
    { name: "Miami", lat: 25.7617, lon: -80.1918 },
];

// Indian cities for localized data
export const INDIAN_CITIES = [
    { name: "Mumbai", lat: 19.076, lon: 72.8777 },
    { name: "Delhi", lat: 28.7041, lon: 77.1025 },
    { name: "Chennai", lat: 13.0827, lon: 80.2707 },
    { name: "Bangalore", lat: 12.9716, lon: 77.5946 },
    { name: "Kolkata", lat: 22.5726, lon: 88.3639 },
];

// Weather condition icons mapping
export const WEATHER_ICONS = {
    "01d": "sunny",
    "01n": "clear-night",
    "02d": "partly-cloudy-day",
    "02n": "partly-cloudy-night",
    "03d": "cloudy",
    "03n": "cloudy",
    "04d": "overcast",
    "04n": "overcast",
    "09d": "rainy",
    "09n": "rainy",
    "10d": "rain",
    "10n": "rain",
    "11d": "thunderstorm",
    "11n": "thunderstorm",
    "13d": "snow",
    "13n": "snow",
    "50d": "mist",
    "50n": "mist",
};

// UV Index levels
export const UV_LEVELS = {
    LOW: { max: 2, color: "#4ade80", label: "Low" },
    MODERATE: { max: 5, color: "#facc15", label: "Moderate" },
    HIGH: { max: 7, color: "#fb923c", label: "High" },
    VERY_HIGH: { max: 10, color: "#ef4444", label: "Very High" },
    EXTREME: { max: 15, color: "#a855f7", label: "Extreme" },
};

// AQI levels
export const AQI_LEVELS = {
    GOOD: { max: 50, color: "#4ade80", label: "Good" },
    SATISFACTORY: { max: 100, color: "#a3e635", label: "Satisfactory" },
    MODERATE: { max: 200, color: "#facc15", label: "Moderate" },
    POOR: { max: 300, color: "#fb923c", label: "Poor" },
    VERY_POOR: { max: 400, color: "#ef4444", label: "Very Poor" },
    SEVERE: { max: 500, color: "#7f1d1d", label: "Severe" },
};
