import { useState, useEffect, useCallback } from "react";
import { WEATHER_API_KEY, WEATHER_API_BASE } from "../constants";

/**
 * Custom hook for fetching and managing weather data
 */
export const useWeatherData = (initialLat = null, initialLon = null) => {
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [airQualityData, setAirQualityData] = useState(null);
    const [location, setLocation] = useState({ lat: initialLat, lon: initialLon });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch current weather
    const fetchCurrentWeather = useCallback(async (lat, lon) => {
        try {
            const response = await fetch(
                `${WEATHER_API_BASE}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
            );
            if (!response.ok) throw new Error("Failed to fetch weather data");
            const data = await response.json();
            return data;
        } catch (err) {
            throw err;
        }
    }, []);

    // Fetch 5-day forecast
    const fetchForecast = useCallback(async (lat, lon) => {
        try {
            const response = await fetch(
                `${WEATHER_API_BASE}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
            );
            if (!response.ok) throw new Error("Failed to fetch forecast data");
            const data = await response.json();
            return data;
        } catch (err) {
            throw err;
        }
    }, []);

    // Fetch air quality data
    const fetchAirQuality = useCallback(async (lat, lon) => {
        try {
            const response = await fetch(
                `${WEATHER_API_BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`
            );
            if (!response.ok) throw new Error("Failed to fetch air quality data");
            const data = await response.json();
            return data;
        } catch (err) {
            throw err;
        }
    }, []);

    // Main fetch function
    const fetchAllData = useCallback(async (lat, lon) => {
        setIsLoading(true);
        setError(null);

        try {
            const [weather, forecast, airQuality] = await Promise.all([
                fetchCurrentWeather(lat, lon),
                fetchForecast(lat, lon),
                fetchAirQuality(lat, lon),
            ]);

            setWeatherData(weather);
            setForecastData(forecast);
            setAirQualityData(airQuality);
        } catch (err) {
            setError(err.message);
            console.error("Error fetching weather data:", err);
        } finally {
            setIsLoading(false);
        }
    }, [fetchCurrentWeather, fetchForecast, fetchAirQuality]);

    // Get user's geolocation and fetch data
    useEffect(() => {
        if (location.lat && location.lon) {
            fetchAllData(location.lat, location.lon);
        } else {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lon: longitude });
                    fetchAllData(latitude, longitude);
                },
                (err) => {
                    console.error("Error getting geolocation:", err);
                    // Default to New York if geolocation fails
                    const defaultLat = 40.7128;
                    const defaultLon = -74.006;
                    setLocation({ lat: defaultLat, lon: defaultLon });
                    fetchAllData(defaultLat, defaultLon);
                }
            );
        }
    }, []);

    // Update location and refetch
    const updateLocation = useCallback((lat, lon) => {
        setLocation({ lat, lon });
        fetchAllData(lat, lon);
    }, [fetchAllData]);

    // Refresh data
    const refresh = useCallback(() => {
        if (location.lat && location.lon) {
            fetchAllData(location.lat, location.lon);
        }
    }, [location, fetchAllData]);

    return {
        weatherData,
        forecastData,
        airQualityData,
        location,
        isLoading,
        error,
        updateLocation,
        refresh,
    };
};

export default useWeatherData;
