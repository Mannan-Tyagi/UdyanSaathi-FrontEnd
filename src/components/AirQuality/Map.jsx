import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import axios from 'axios';
import CustomMapMarker from './CustomMapMarker';
import 'leaflet/dist/leaflet.css';
import { getBaseUrl } from '../Connectivity/storageHelper';

/**
 * Enhanced AQI Map Component - Inspired by OCEMS Design
 * Features: Clean map tiles, styled markers, header with controls
 */
const Map = ({ selectedSearch }) => {
    const [data, setData] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [level, setLevel] = useState(5);
    const [key, setKey] = useState(0);
    const [popupStation, setPopupStation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('city'); // 'city' or 'district'

    // Stats for the progress cards
    const [stats, setStats] = useState({
        totalStations: 0,
        goodCount: 0,
        moderateCount: 0,
        poorCount: 0,
        severeCount: 0
    });

    useEffect(() => {
        const baseurl = getBaseUrl();
        setIsLoading(true);
        fetch(`${baseurl}get-MapData/`)
            .then(response => response.json())
            .then(data => {
                setData(data);
                calculateStats(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching AQI data:', error);
                setIsLoading(false);
            });
    }, [selectedSearch]);

    const calculateStats = (mapData) => {
        const stats = mapData.reduce((acc, item) => {
            acc.totalStations++;
            if (item.AQI <= 50) acc.goodCount++;
            else if (item.AQI <= 100) acc.moderateCount++;
            else if (item.AQI <= 200) acc.poorCount++;
            else acc.severeCount++;
            return acc;
        }, { totalStations: 0, goodCount: 0, moderateCount: 0, poorCount: 0, severeCount: 0 });
        setStats(stats);
    };

    useEffect(() => {
        if (selectedSearch) {
            const baseurl = getBaseUrl();
            const fetchMapCenter = async () => {
                try {
                    const response = await axios.get(`${baseurl}get-stations_coordinates/?pol_Station=${encodeURIComponent(selectedSearch)}`);
                    const stationData = response.data[0];
                    if (stationData) {
                        setMapCenter([stationData.Latitude, stationData.Longitude]);
                        setLevel(12);
                        setKey(prevKey => prevKey + 1);
                        setPopupStation(selectedSearch);
                    }
                } catch (error) {
                    console.error('Error fetching station coordinates:', error);
                }
            };
            fetchMapCenter();
        }
    }, [selectedSearch]);

    return (
        <div className="map-section">
            {/* Map Header */}
            <div className="map-header">
                <div className="map-header-left">
                    <button className="map-menu-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="3" y1="6" x2="21" y2="6"/>
                            <line x1="3" y1="12" x2="21" y2="12"/>
                            <line x1="3" y1="18" x2="21" y2="18"/>
                        </svg>
                    </button>
                    <div className="map-title-group">
                        <h2 className="map-title">Air Quality Monitoring</h2>
                        <p className="map-subtitle">Real-time AQI Data</p>
                    </div>
                </div>
                
                <div className="map-header-right">
                    <div className="map-search">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                    </div>
                    
                    <div className="map-view-toggle">
                        <button 
                            className={`toggle-btn ${viewMode === 'district' ? 'active' : ''}`}
                            onClick={() => setViewMode('district')}
                        >
                            District
                        </button>
                        <button 
                            className={`toggle-btn ${viewMode === 'city' ? 'active' : ''}`}
                            onClick={() => setViewMode('city')}
                        >
                            City
                        </button>
                    </div>
                </div>
            </div>

            {/* Map Container */}
            <div className="map-container-wrapper">
                {isLoading && (
                    <div className="map-loading">
                        <div className="map-loading-spinner"></div>
                        <p>Loading stations...</p>
                    </div>
                )}
                
                <MapContainer 
                    key={key} 
                    center={mapCenter} 
                    animate={true} 
                    zoom={level} 
                    style={{ height: '450px', width: '100%' }} 
                    className="aqi-map"
                    zoomControl={false}
                >
                    {/* Clean, light map tiles */}
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                    />
                    <ZoomControl position="bottomright" />
                    
                    {data.map((row, index) => (
                        <CustomMapMarker
                            key={index}
                            position={[row.Latitude, row.Longitude]}
                            aqi={row.AQI}
                            station={row.Station}
                            city={row.City}
                            state={row.State}
                            polDate={row.Pol_Date}
                            highlight={popupStation && popupStation === row.Station}
                            shouldOpenPopup={popupStation && popupStation === row.Station}
                        />
                    ))}
                </MapContainer>
            </div>

            {/* Stats Progress Cards */}
            <div className="map-stats-row">
                <div className="stat-card">
                    <div className="stat-info">
                        <p className="stat-label">Active Monitoring Stations</p>
                        <p className="stat-sublabel">Real-time data</p>
                    </div>
                    <div className="stat-value-group">
                        <span className="stat-value">{stats.totalStations}</span>
                        <span className="stat-total">/{stats.totalStations}</span>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-bar progress-primary" style={{ width: '100%' }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <p className="stat-label">Good Air Quality</p>
                        <p className="stat-sublabel">AQI ≤ 50</p>
                    </div>
                    <div className="stat-value-group">
                        <span className="stat-value">{stats.goodCount}</span>
                        <span className="stat-total">/{stats.totalStations}</span>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-bar progress-good" style={{ width: `${(stats.goodCount / stats.totalStations) * 100}%` }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <p className="stat-label">Moderate Quality</p>
                        <p className="stat-sublabel">AQI 51-100</p>
                    </div>
                    <div className="stat-value-group">
                        <span className="stat-value">{stats.moderateCount}</span>
                        <span className="stat-total">/{stats.totalStations}</span>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-bar progress-moderate" style={{ width: `${(stats.moderateCount / stats.totalStations) * 100}%` }}></div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-info">
                        <p className="stat-label">Poor/Severe</p>
                        <p className="stat-sublabel">AQI &gt; 100</p>
                    </div>
                    <div className="stat-value-group">
                        <span className="stat-value">{stats.poorCount + stats.severeCount}</span>
                        <span className="stat-total">/{stats.totalStations}</span>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-bar progress-poor" style={{ width: `${((stats.poorCount + stats.severeCount) / stats.totalStations) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;
