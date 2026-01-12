import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import axios from 'axios';
import CustomMapMarker from './CustomMapMarker';
import 'leaflet/dist/leaflet.css';
import { getBaseUrl } from '../Connectivity/storageHelper';

/**
 * Production-Ready AQI Map Component
 * Clean, minimal design with professional aesthetics
 */
const Map = ({ selectedSearch }) => {
    const [data, setData] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [level, setLevel] = useState(5);
    const [key, setKey] = useState(0);
    const [popupStation, setPopupStation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Stats for the indicator bar
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

    const getPercentage = (count) => stats.totalStations > 0 ? ((count / stats.totalStations) * 100).toFixed(0) : 0;

    return (
        <div className="relative">
            {/* Map Container */}
            <div className="relative bg-canvas rounded-xl overflow-hidden">
                {/* Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-2 border-mist border-t-primary rounded-full animate-spin"></div>
                            <span className="text-sm text-metal">Loading stations...</span>
                        </div>
                    </div>
                )}
                
                {/* Map */}
                <MapContainer 
                    key={key} 
                    center={mapCenter} 
                    animate={true} 
                    zoom={level} 
                    style={{ height: '420px', width: '100%' }} 
                    className="aqi-map z-10"
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
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

                {/* Floating Stats Overlay - Top Left */}
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-soft border border-mist px-4 py-3">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-status-good rounded-full animate-pulse"></div>
                            <span className="text-xs font-semibold text-ink">{stats.totalStations} Active Stations</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-metal">
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-status-good rounded-full"></span>
                                {stats.goodCount} Good
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-status-moderate rounded-full"></span>
                                {stats.moderateCount + stats.poorCount} Moderate
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-status-critical rounded-full"></span>
                                {stats.severeCount} Severe
                            </span>
                        </div>
                    </div>
                </div>

                {/* AQI Legend - Bottom Left */}
                <div className="absolute bottom-4 left-4 z-20">
                    <div className="bg-white/95 backdrop-blur-md rounded-lg shadow-soft border border-mist p-3">
                        <p className="text-[10px] font-medium text-metal uppercase tracking-wider mb-2">AQI Scale</p>
                        <div className="flex gap-1">
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-2 rounded-sm bg-status-good"></div>
                                <span className="text-[9px] text-metal mt-1">0-50</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-2 rounded-sm bg-aqi-satisfactory"></div>
                                <span className="text-[9px] text-metal mt-1">51-100</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-2 rounded-sm bg-aqi-moderate"></div>
                                <span className="text-[9px] text-metal mt-1">101-200</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-2 rounded-sm bg-aqi-poor"></div>
                                <span className="text-[9px] text-metal mt-1">201-300</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-6 h-2 rounded-sm bg-status-critical"></div>
                                <span className="text-[9px] text-metal mt-1">300+</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compact Stats Bar - Below Map */}
            <div className="mt-4 grid grid-cols-4 gap-3">
                <div className="bg-canvas rounded-xl p-3 border border-mist">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-metal">Total</span>
                        <span className="text-sm font-bold text-ink">{stats.totalStations}</span>
                    </div>
                    <div className="h-1.5 bg-mist rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: '100%' }}></div>
                    </div>
                </div>
                <div className="bg-canvas rounded-xl p-3 border border-mist">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-metal">Good</span>
                        <span className="text-sm font-bold text-status-good">{stats.goodCount}</span>
                    </div>
                    <div className="h-1.5 bg-mist rounded-full overflow-hidden">
                        <div className="h-full bg-status-good rounded-full transition-all duration-500" style={{ width: `${getPercentage(stats.goodCount)}%` }}></div>
                    </div>
                </div>
                <div className="bg-canvas rounded-xl p-3 border border-mist">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-metal">Moderate</span>
                        <span className="text-sm font-bold text-status-moderate">{stats.moderateCount + stats.poorCount}</span>
                    </div>
                    <div className="h-1.5 bg-mist rounded-full overflow-hidden">
                        <div className="h-full bg-status-moderate rounded-full transition-all duration-500" style={{ width: `${getPercentage(stats.moderateCount + stats.poorCount)}%` }}></div>
                    </div>
                </div>
                <div className="bg-canvas rounded-xl p-3 border border-mist">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-metal">Severe</span>
                        <span className="text-sm font-bold text-status-critical">{stats.severeCount}</span>
                    </div>
                    <div className="h-1.5 bg-mist rounded-full overflow-hidden">
                        <div className="h-full bg-status-critical rounded-full transition-all duration-500" style={{ width: `${getPercentage(stats.severeCount)}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Map;
