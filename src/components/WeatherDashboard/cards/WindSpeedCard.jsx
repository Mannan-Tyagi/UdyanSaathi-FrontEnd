import React, { useEffect, useRef } from "react";
import { Compass } from "../ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WindSpeedCard = ({ weatherData, location }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Default coordinates (will be updated when we have location)
        const lat = location?.lat || 28.6139;
        const lon = location?.lon || 77.209;

        // Initialize map with dark theme
        const map = L.map(mapRef.current, {
            center: [lat, lon],
            zoom: 10,
            zoomControl: false,
            attributionControl: false,
        });

        // Dark/Satellite tile layer - CartoDB Dark Matter (free, no API key needed)
        L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            {
                subdomains: "abcd",
                maxZoom: 19,
            }
        ).addTo(map);

        // Add a custom marker for user location
        const pulseIcon = L.divIcon({
            className: "wd-pulse-marker",
            html: `
                <div class="wd-marker-outer">
                    <div class="wd-marker-inner"></div>
                    <div class="wd-marker-pulse"></div>
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
        });

        L.marker([lat, lon], { icon: pulseIcon }).addTo(map);

        // Add minimal zoom control
        L.control
            .zoom({
                position: "bottomright",
            })
            .addTo(map);

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
            mapInstanceRef.current.setView([location.lat, location.lon], 10, {
                animate: true,
                duration: 1,
            });

            // Clear existing markers and add new one
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstanceRef.current.removeLayer(layer);
                }
            });

            const pulseIcon = L.divIcon({
                className: "wd-pulse-marker",
                html: `
                    <div class="wd-marker-outer">
                        <div class="wd-marker-inner"></div>
                        <div class="wd-marker-pulse"></div>
                    </div>
                `,
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });

            L.marker([location.lat, location.lon], { icon: pulseIcon }).addTo(
                mapInstanceRef.current
            );
        }
    }, [location]);

    if (!weatherData) {
        return (
            <div className="wd-card wd-wind-card">
                <div className="wd-loading">
                    <div className="wd-spinner"></div>
                </div>
            </div>
        );
    }

    const windSpeed = weatherData.wind.speed;
    const windDeg = weatherData.wind.deg || 0;
    const windKmh = (windSpeed * 3.6).toFixed(0);
    const gustSpeed = weatherData.wind.gust
        ? (weatherData.wind.gust * 3.6).toFixed(0)
        : null;

    // Calculate trend (mock - in real app would compare with previous data)
    const trend = Math.random() > 0.5 ? "up" : "down";
    const trendValue = (Math.random() * 5).toFixed(1);

    return (
        <div className="wd-card wd-wind-card">
            <div className="wd-wind-card-layout">
                {/* Left Section - Wind Info */}
                <div className="wd-wind-info-section">
                    <div className="wd-wind-header">
                        <h3 className="wd-section-title">Wind Speed</h3>
                        <div className="wd-wind-badge">
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M9.59 4.59A2 2 0 1111 8H2m10.59 11.41A2 2 0 1014 16H2m15.73-8.27A2.5 2.5 0 1119.5 12H2" />
                            </svg>
                            Live
                        </div>
                    </div>

                    <div className="wd-wind-value-container">
                        <span className="wd-wind-value">{windKmh}</span>
                        <div className="wd-wind-unit-group">
                            <span className="wd-wind-unit">km</span>
                            <span className="wd-wind-unit-divider">/</span>
                            <span className="wd-wind-unit">h</span>
                        </div>
                    </div>

                    <div className="wd-wind-stats">
                        <div
                            className={`wd-wind-trend ${trend === "up" ? "wd-trend-up" : "wd-trend-down"}`}
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                {trend === "up" ? (
                                    <path d="M23 6l-9.5 9.5-5-5L1 18" />
                                ) : (
                                    <path d="M23 18l-9.5-9.5-5 5L1 6" />
                                )}
                            </svg>
                            <span>
                                {trend === "up" ? "+" : "-"}
                                {trendValue}%
                            </span>
                        </div>
                        <span className="wd-wind-compare">vs 1 hour ago</span>
                    </div>

                    {gustSpeed && (
                        <div className="wd-wind-gust">
                            <span className="wd-gust-label">Gusts up to</span>
                            <span className="wd-gust-value">{gustSpeed} km/h</span>
                        </div>
                    )}

                    {/* Compass */}
                    <div className="wd-compass-section">
                        <Compass
                            degrees={windDeg}
                            speed={windSpeed.toFixed(1)}
                            unit="m/s"
                        />
                    </div>
                </div>

                {/* Right Section - Map */}
                <div className="wd-wind-map-section">
                    <div className="wd-map-container" ref={mapRef}>
                        {/* Leaflet map renders here */}
                    </div>
                    <div className="wd-map-overlay">
                        <span className="wd-map-label">
                            {location?.lat?.toFixed(2)}°N, {location?.lon?.toFixed(2)}°E
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WindSpeedCard;
