import React, { useEffect, useRef } from "react";
import { Compass } from "../ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WEATHER_API_KEY } from "../constants";

const WindSpeedCard = ({ weatherData, location }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Default coordinates (will be updated when we have location)
        const lat = location?.lat || 28.6139;
        const lon = location?.lon || 77.209;

        // Initialize map
        const map = L.map(mapRef.current, {
            center: [lat, lon],
            zoom: 6,
            zoomControl: false,
        });

        // Add base tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
        }).addTo(map);

        // Add weather layer (clouds)
        L.tileLayer(
            `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`,
            {
                opacity: 0.6,
            }
        ).addTo(map);

        // Add precipitation layer
        L.tileLayer(
            `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${WEATHER_API_KEY}`,
            {
                opacity: 0.5,
            }
        ).addTo(map);

        // Add zoom control to the right
        L.control.zoom({ position: "topright" }).addTo(map);

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Update map center when location changes
    useEffect(() => {
        if (mapInstanceRef.current && location?.lat && location?.lon) {
            mapInstanceRef.current.setView([location.lat, location.lon], 6);
        }
    }, [location]);

    if (!weatherData) {
        return (
            <div className="wd-card">
                <div className="wd-wind-card-new">
                    <div className="wd-loading">
                        <div className="wd-spinner"></div>
                    </div>
                </div>
            </div>
        );
    }

    const windSpeed = weatherData.wind.speed;
    const windDeg = weatherData.wind.deg || 0;
    const windKmh = (windSpeed * 3.6).toFixed(0);

    return (
        <div className="wd-card">
            <div className="wd-wind-card-new">
                {/* Left Section - Wind Info */}
                <div className="wd-wind-left">
                    <h3 className="wd-section-title">Wind speed</h3>

                    <div className="wd-wind-display">
                        <span className="wd-wind-value">{windKmh}</span>
                        <span className="wd-wind-unit">km<span className="wd-wind-unit-small">/h</span></span>
                    </div>

                    <div className="wd-wind-trend">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                            <polyline points="23,6 13.5,15.5 8.5,10.5 1,18" />
                            <polyline points="17,6 23,6 23,12" />
                        </svg>
                        <span className="wd-trend-value">+2.3%</span>
                        <span className="wd-trend-wave">〰</span>
                    </div>

                    <p className="wd-wind-compare">VS 1 hours ago</p>

                    {/* Compass */}
                    <div className="wd-compass-wrapper">
                        <Compass
                            degrees={windDeg}
                            speed={windSpeed.toFixed(1)}
                            unit="m/s"
                        />
                    </div>
                </div>

                {/* Right Section - Map */}
                <div className="wd-wind-right">
                    <div className="wd-map-wrapper" ref={mapRef}>
                        {/* Leaflet map renders here */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindSpeedCard;
