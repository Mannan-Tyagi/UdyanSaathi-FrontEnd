import React, { useRef, useEffect, forwardRef } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

/**
 * Enhanced Custom Map Marker - Inspired by OCEMS Design
 * Features: Colored circular markers with AQI value, premium popup cards
 */

// Get AQI color based on value (EPA/CPCB Standard)
const getAqiColor = (aqi) => {
    if (aqi <= 50) return { bg: '#48BB78', text: '#fff', label: 'Good', ring: '#68D391' };
    if (aqi <= 100) return { bg: '#ECC94B', text: '#744210', label: 'Satisfactory', ring: '#F6E05E' };
    if (aqi <= 150) return { bg: '#ED8936', text: '#fff', label: 'Moderate', ring: '#F6AD55' };
    if (aqi <= 200) return { bg: '#F56565', text: '#fff', label: 'Poor', ring: '#FC8181' };
    if (aqi <= 300) return { bg: '#9F7AEA', text: '#fff', label: 'Very Poor', ring: '#B794F4' };
    return { bg: '#C53030', text: '#fff', label: 'Severe', ring: '#FC8181' };
};

// Create circular marker icon with AQI value
const createMarkerIcon = (aqi, highlight) => {
    const colors = getAqiColor(aqi);
    const size = highlight ? 48 : 36;
    const fontSize = highlight ? 14 : 11;
    
    // Modern circular marker with shadow and ring
    const svg = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <filter id="shadow-${aqi}" x="-50%" y="-50%" width="200%" height="200%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${colors.bg}" flood-opacity="0.4"/>
                </filter>
            </defs>
            <!-- Outer ring -->
            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${colors.ring}" opacity="0.3"/>
            <!-- Main circle -->
            <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="${colors.bg}" filter="url(#shadow-${aqi})"/>
            <!-- Inner highlight -->
            <circle cx="${size/2}" cy="${size/2 - 2}" r="${size/2 - 8}" fill="white" opacity="0.15"/>
            <!-- AQI text -->
            <text x="50%" y="54%" font-size="${fontSize}" font-weight="700" fill="${colors.text}" 
                  text-anchor="middle" dominant-baseline="middle" font-family="Inter, system-ui, sans-serif">
                ${aqi}
            </text>
        </svg>
    `;
    
    return new L.DivIcon({
        html: svg,
        className: `aqi-marker ${highlight ? 'aqi-marker-highlight' : ''}`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -size / 2]
    });
};

// Premium Popup Content Component
const PopupContent = ({ station, city, aqi, polDate, state }) => {
    const colors = getAqiColor(aqi);
    
    // Generate mock breakdown data based on AQI (in real app, this comes from API)
    const getBreakdown = (aqi) => {
        const total = Math.floor(aqi * 0.8);
        return {
            good: Math.floor(total * 0.2),
            satisfactory: Math.floor(total * 0.25),
            moderate: Math.floor(total * 0.3),
            poor: Math.floor(total * 0.25)
        };
    };
    
    const breakdown = getBreakdown(aqi);
    
    return `
        <div class="aqi-popup-card">
            <div class="aqi-popup-header">
                <div class="aqi-popup-status">
                    <span class="aqi-status-dot" style="background: ${colors.bg}"></span>
                    <span class="aqi-status-label">${colors.label}</span>
                </div>
                <button class="aqi-popup-action" title="Download">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                </button>
            </div>
            
            <h3 class="aqi-popup-title">${station}</h3>
            <p class="aqi-popup-subtitle">${city}${state ? `, ${state}` : ''}</p>
            
            <div class="aqi-popup-breakdown">
                <div class="breakdown-bar">
                    <div class="breakdown-segment" style="width: ${breakdown.good}%; background: #48BB78;"></div>
                    <div class="breakdown-segment" style="width: ${breakdown.satisfactory}%; background: #ECC94B;"></div>
                    <div class="breakdown-segment" style="width: ${breakdown.moderate}%; background: #ED8936;"></div>
                    <div class="breakdown-segment" style="width: ${breakdown.poor}%; background: #F56565;"></div>
                </div>
                <div class="breakdown-labels">
                    <span>${breakdown.good}</span>
                    <span>${breakdown.satisfactory}</span>
                    <span>${breakdown.moderate}</span>
                    <span>${breakdown.poor}</span>
                </div>
            </div>
            
            <div class="aqi-popup-footer">
                <div class="aqi-popup-value">
                    <span class="aqi-label">AQI:</span>
                    <span class="aqi-number" style="color: ${colors.bg}">${aqi}</span>
                    <span class="aqi-quality">(${colors.label})</span>
                </div>
                <button class="aqi-view-details">
                    <span>+</span> View Details
                </button>
            </div>
            
            <p class="aqi-popup-date">Last updated: ${polDate}</p>
        </div>
    `;
};

const CustomMapMarker = forwardRef(({ position, aqi, station, city, state, polDate, highlight, shouldOpenPopup }, ref) => {
    const markerRef = useRef(null);

    useEffect(() => {
        const marker = markerRef.current;
        if (marker) {
            if (shouldOpenPopup) {
                setTimeout(() => marker.openPopup(), 100);
            }

            const handleMouseOver = () => marker.openPopup();
            const handleMouseOut = () => {
                if (!shouldOpenPopup) marker.closePopup();
            };

            marker.on('mouseover', handleMouseOver);
            marker.on('mouseout', handleMouseOut);

            return () => {
                marker.off('mouseover', handleMouseOver);
                marker.off('mouseout', handleMouseOut);
            };
        }
    }, [shouldOpenPopup]);

    const markerIcon = createMarkerIcon(aqi, highlight);
    
    return (
        <Marker position={position} icon={markerIcon} ref={markerRef}>
            <Popup 
                className="aqi-custom-popup"
                closeButton={false}
                autoPan={true}
                maxWidth={320}
                minWidth={280}
            >
                <div dangerouslySetInnerHTML={{ 
                    __html: PopupContent({ station, city, aqi, polDate, state }) 
                }} />
            </Popup>
        </Marker>
    );
});

CustomMapMarker.displayName = 'CustomMapMarker';

export default CustomMapMarker;
