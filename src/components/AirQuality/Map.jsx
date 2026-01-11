import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import axios from 'axios';
import CustomMapMarker from './CustomMapMarker'; // Ensure you have CustomMapMarker component
import 'leaflet/dist/leaflet.css';
import { getBaseUrl } from '../Connectivity/storageHelper'; // Adjust imports as needed

const Map = ({ selectedSearch }) => {
    const [data, setData] = useState([]);
    const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]);
    const [level, setLevel] = useState(5);
    const [key, setKey] = useState(0);
    const [popupStation, setPopupStation] = useState(null);

    useEffect(() => {
        const baseurl = getBaseUrl();
        fetch(`${baseurl}get-MapData/`)
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Error fetching AQI data:', error));
    }, [selectedSearch]);

    useEffect(() => {
        if (selectedSearch) {
            const baseurl = getBaseUrl();
            const fetchMapCenter = async () => {
                try {


                    const baseurl = getBaseUrl();

                    const response = await axios.get(`${baseurl}get-stations_coordinates/?pol_Station=${encodeURIComponent(selectedSearch)}`);
                    const stationData = response.data[0];
                    if (stationData) {
                        setMapCenter([stationData.Latitude, stationData.Longitude]);
                        setLevel(12);
                        setKey(prevKey => prevKey + 1);
                        setPopupStation(selectedSearch); // Update the station for which to show popup
                    } else {
                        console.error('Station data not found.');
                    }
                } catch (error) {
                    console.error('Error fetching station coordinates:', error);
                }
            };
            fetchMapCenter();
        }
    }, [selectedSearch]);

    return (
        <div className="map-wrapper rounded-card overflow-hidden shadow-card border border-mist">
            <MapContainer 
                key={key} 
                center={mapCenter} 
                animate={true} 
                zoom={level} 
                style={{ height: '50vh', width: '100%' }} 
                className="rounded-card"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {data.map((row, index) => (
                    <CustomMapMarker
                        key={index}
                        position={[row.Latitude, row.Longitude]}
                        aqi={row.AQI}
                        station={row.Station}
                        city={row.City}
                        polDate={row.Pol_Date}
                        highlight={popupStation && popupStation === row.Station}
                        shouldOpenPopup={popupStation && popupStation === row.Station}
                    />
                ))}
            </MapContainer>
        </div>
    );
};

export default Map;
