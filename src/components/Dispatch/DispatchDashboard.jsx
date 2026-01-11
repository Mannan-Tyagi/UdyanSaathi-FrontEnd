/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import ProfessionalNavbar from '../navbar/ProfessionalNavbar';

// Map controller component to handle zoom and pan
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.5
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

const DispatchDashboard = () => {
  const [activeMissions, setActiveMissions] = useState([]);
  const [fleetStatus, setFleetStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [demoInitialized, setDemoInitialized] = useState(false);
  
  // Map focus state
  const [mapCenter, setMapCenter] = useState([23.0, 77.0]);
  const [mapZoom, setMapZoom] = useState(5);
  const [selectedMission, setSelectedMission] = useState(null);

  const baseUrl = "https://apiudyansaathi2-fscmg2hxd8euf0bs.eastus-01.azurewebsites.net/api/";

  useEffect(() => {
    checkAndInitialize();
  }, []);

  useEffect(() => {
    if (demoInitialized) {
      fetchData();
      
      if (autoRefresh) {
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
      }
    }
  }, [autoRefresh, demoInitialized]);

  const checkAndInitialize = async () => {
    try {
      console.log("Checking fleet status at:", `${baseUrl}dispatch/fleet-status/`);
      const response = await fetch(`${baseUrl}dispatch/fleet-status/`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fleet status response:", data);
      
      if (data.total_assets === 0) {
        console.log("No assets found, initializing demo...");
        await initializeDemo();
      } else {
        console.log(`Found ${data.total_assets} assets, skipping initialization`);
        setDemoInitialized(true);
      }
    } catch (error) {
      console.error("Error checking fleet:", error);
      alert(`Failed to connect to API: ${error.message}\n\nMake sure Django server is running at ${baseUrl}`);
      setLoading(false);
    }
  };

  const initializeDemo = async () => {
    setLoading(true);
    try {
      console.log("Initializing demo at:", `${baseUrl}dispatch/initialize-demo/`);
      const response = await fetch(`${baseUrl}dispatch/initialize-demo/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log("Initialization result:", result);
      
      if (result.status === 'DEMO_COMPLETE') {
        setDemoInitialized(true);
        alert(`✅ Demo initialized!\n\n` +
              `Fleet Assets: ${result.summary.fleet_assets}\n` +
              `Active Missions: ${result.summary.active_missions}\n` +
              `Historical Data: ${result.summary.historical_interventions}`);
      }
    } catch (error) {
      console.error("Error initializing demo:", error);
      alert(`Failed to initialize demo: ${error.message}\n\nCheck console for details.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      console.log("Fetching dispatch data...");
      const [missionsRes, fleetRes, statsRes] = await Promise.all([
        fetch(`${baseUrl}dispatch/active-missions/`),
        fetch(`${baseUrl}dispatch/fleet-status/`),
        fetch(`${baseUrl}dispatch/stats/`)
      ]);

      if (!missionsRes.ok || !fleetRes.ok || !statsRes.ok) {
        throw new Error('One or more API calls failed');
      }

      const missionsData = await missionsRes.json();
      const fleetData = await fleetRes.json();
      const statsData = await statsRes.json();

      console.log("Missions data:", missionsData);
      console.log("Fleet data:", fleetData);
      console.log("Stats data:", statsData);

      setActiveMissions(missionsData.missions || []);
      setFleetStatus(fleetData);
      setStats(statsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching dispatch data:", error);
      alert(`Error loading data: ${error.message}`);
      setLoading(false);
    }
  };

  // Handle mission card click to focus map
  const handleMissionClick = (mission) => {
    setSelectedMission(mission.ticket_id);
    
    // Calculate midpoint between asset and target for better view
    const midLat = (mission.asset_current_lat + mission.target_lat) / 2;
    const midLon = (mission.asset_current_lon + mission.target_lon) / 2;
    
    setMapCenter([midLat, midLon]);
    setMapZoom(11);
    
    // Auto-deselect after 5 seconds
    setTimeout(() => {
      setSelectedMission(null);
    }, 5000);
  };

  // Reset map view
  const resetMapView = () => {
    setMapCenter([23.0, 77.0]);
    setMapZoom(5);
    setSelectedMission(null);
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'CRITICAL': 'bg-red-600',
      'HIGH': 'bg-orange-500',
      'MEDIUM': 'bg-yellow-500',
      'LOW': 'bg-green-500'
    };
    return colors[urgency] || 'bg-gray-500';
  };

  const getStatusColor = (status) => {
    const colors = {
      'IDLE': 'text-green-600',
      'DISPATCHED': 'text-blue-600',
      'ACTIVE': 'text-orange-600',
      'RETURNING': 'text-purple-600',
      'MAINTENANCE': 'text-red-600'
    };
    return colors[status] || 'text-gray-600';
  };

  // Custom icons
  const smogGunIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const targetIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const idleIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas">
        <ProfessionalNavbar onSearchSelected={() => {}} />
        <div className="flex items-center justify-center h-[80vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bento-card p-12"
          >
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-mist"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold text-ink mb-2">
              {demoInitialized ? 'Loading Dispatch Data' : 'Initializing System'}
            </h2>
            <p className="text-metal">
              {demoInitialized ? 'Fetching mission data...' : 'Setting up demo environment...'}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas page-gradient">
      {/* Professional Navbar */}
      <ProfessionalNavbar onSearchSelected={() => {}} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-2">
          🚨 Dispatch Command Center
        </h1>
        <p className="text-metal">Pre-emptive pollution intervention system (Demo Mode)</p>
        <div className="mt-4 inline-flex items-center space-x-2 bg-surface border border-mist px-4 py-2 rounded-xl shadow-card">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-semibold text-primary">LIVE TRACKING ACTIVE</span>
        </div>
      </motion.div>

      {/* Stats Summary Cards */}
      {fleetStatus && stats && (
        <>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6"
          >
            <motion.div whileHover={{ y: -3 }} className="bento-card p-4">
              <div className="text-3xl font-bold text-ink">{fleetStatus.total_assets}</div>
              <div className="text-xs text-metal font-medium">Total Assets</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="bento-card p-4 border-status-safe/30">
              <div className="text-3xl font-bold text-status-safe">{fleetStatus.idle}</div>
              <div className="text-xs text-metal font-medium">Idle</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="bento-card p-4 border-primary/30">
              <div className="text-3xl font-bold text-primary">{fleetStatus.dispatched}</div>
              <div className="text-xs text-metal font-medium">Dispatched</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="bento-card p-4 border-status-warning/30">
              <div className="text-3xl font-bold text-status-warning">{fleetStatus.active}</div>
              <div className="text-xs text-metal font-medium">Active</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="bento-card p-4 border-purple-500/30">
              <div className="text-3xl font-bold text-purple-600">{fleetStatus.returning}</div>
              <div className="text-xs text-metal font-medium">Returning</div>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} className="bento-card p-4 border-status-danger/30">
              <div className="text-3xl font-bold text-status-danger">{fleetStatus.maintenance}</div>
              <div className="text-xs text-metal font-medium">Maintenance</div>
            </motion.div>
          </motion.div>

          {/* Effectiveness Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
          >
            <motion.div whileHover={{ scale: 1.02 }} className="bg-status-safe rounded-card shadow-card p-6 text-white">
              <div className="text-5xl font-bold">{stats.summary.average_reduction_percentage}%</div>
              <div className="text-sm opacity-90 font-medium mt-1">Average PM2.5 Reduction</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-primary rounded-card shadow-card p-6 text-white">
              <div className="text-5xl font-bold">{stats.summary.total_interventions}</div>
              <div className="text-sm opacity-90 font-medium mt-1">Total Interventions</div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} className="bg-purple-600 rounded-card shadow-card p-6 text-white">
              <div className="text-5xl font-bold">{stats.summary.total_water_used_kl} KL</div>
              <div className="text-sm opacity-90 font-medium mt-1">Water Used</div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Missions List */}
        <div className="lg:col-span-1">
          <div className="bento-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-ink">Active Missions</h2>
              <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
                {activeMissions.length}
              </span>
            </div>

            <div className="space-y-4 max-h-[700px] overflow-y-auto">
              {activeMissions.length === 0 ? (
                <div className="text-center py-8 text-metal bg-canvas rounded-card">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="font-semibold text-ink">No active missions</p>
                  <p className="text-sm">All stations secure</p>
                </div>
              ) : (
                activeMissions.map((mission) => (
                  <div 
                    key={mission.ticket_id}
                    onClick={() => handleMissionClick(mission)}
                    className={`border-2 rounded-card p-4 cursor-pointer transition-all duration-300 ${
                      selectedMission === mission.ticket_id 
                        ? 'border-primary bg-primary/5 shadow-card-hover scale-[1.02]' 
                        : 'border-mist hover:border-primary/50 hover:shadow-card bg-surface'
                    }`}
                  >
                    {/* Urgency Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`${getUrgencyColor(mission.urgency_level)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                        {mission.urgency_level}
                      </span>
                      <span className="text-xs text-metal font-mono">
                        {mission.ticket_id}
                      </span>
                    </div>

                    {/* Target Station */}
                    <h3 className="font-bold text-lg text-ink mb-2 flex items-center gap-2">
                      <span>📍</span> {mission.target_station}
                    </h3>

                    {/* Pollution Prediction */}
                    <div className="bg-red-50 border border-red-200 rounded-card p-3 mb-3">
                      <div className="text-sm font-semibold text-red-800 mb-1">Predicted Impact:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs text-red-600">PM2.5</div>
                          <div className="text-lg font-bold text-red-700">{mission.predicted_pm25.toFixed(0)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-red-600">AQI</div>
                          <div className="text-lg font-bold text-red-700">{mission.predicted_aqi}</div>
                        </div>
                      </div>
                    </div>

                    {/* Asset Info */}
                    <div className="flex items-center justify-between mb-3 p-2 bg-canvas rounded-card border border-mist">
                      <div>
                        <span className="text-xs text-metal">Asset:</span>
                        <div className="font-mono text-sm font-bold text-ink">{mission.asset_id}</div>
                      </div>
                      <div className={`font-semibold text-sm ${getStatusColor(mission.asset_status)}`}>
                        {mission.asset_status}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="text-xs text-metal space-y-1 mb-3">
                      <div className="flex items-center gap-2">
                        <span>🕐</span>
                        <span>Dispatched: {new Date(mission.dispatch_time).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span>ETA: {new Date(mission.estimated_arrival).toLocaleTimeString()}</span>
                      </div>
                    </div>

                    {/* Mission Brief */}
                    <div className="text-xs text-ink bg-primary/5 p-3 rounded-card border border-primary/20">
                      <div className="font-semibold mb-1 text-primary">Mission Brief:</div>
                      {mission.mission_brief}
                    </div>

                    {/* Click hint */}
                    {selectedMission !== mission.ticket_id && (
                      <div className="text-xs text-primary font-semibold text-center mt-2 animate-pulse">
                        👆 Click to view on map
                      </div>
                    )}

                    {selectedMission === mission.ticket_id && (
                      <div className="text-xs text-primary font-semibold text-center mt-2">
                        🗺️ Viewing on map
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Interventions */}
          {stats && stats.recent_interventions.length > 0 && (
            <div className="bento-card p-6 mt-6">
              <h2 className="text-xl font-bold text-ink mb-4">Recent Interventions</h2>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {stats.recent_interventions.slice(0, 5).map((log, index) => (
                  <div key={index} className="border border-mist rounded-card p-3 bg-canvas">
                    <div className="font-semibold text-sm text-ink mb-1">{log.station}</div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-metal">Before</div>
                        <div className="font-bold text-status-danger">{log.pre_pm25}</div>
                      </div>
                      <div>
                        <div className="text-metal">After</div>
                        <div className="font-bold text-status-safe">{log.post_pm25}</div>
                      </div>
                      <div>
                        <div className="text-metal">Reduced</div>
                        <div className="font-bold text-primary">{log.reduction_percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="text-xs text-metal mt-2">
                      💧 Water used: {(log.water_used_liters / 1000).toFixed(1)} KL
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="bento-card p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-ink">Live Tracking Map</h2>
              <div className="flex gap-3">
                <button
                  onClick={resetMapView}
                  className="bg-metal text-white px-4 py-2 rounded-button hover:bg-ink transition text-sm font-semibold"
                >
                  🔄 Reset View
                </button>
                <div className="flex gap-2 text-xs items-center text-metal">
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Deployed
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  Target
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Idle
                </span>
                </div>
              </div>
            </div>
            
            <div className="map-wrapper h-[700px] rounded-card overflow-hidden border border-mist">
              <MapContainer
                center={[23.0, 77.0]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {/* Map Controller for smooth zoom/pan */}
                <MapController center={mapCenter} zoom={mapZoom} />

                {/* Plot active missions */}
                {activeMissions.map((mission) => (
                  <React.Fragment key={mission.ticket_id}>
                    {/* Asset current location */}
                    <Marker
                      position={[mission.asset_current_lat, mission.asset_current_lon]}
                      icon={smogGunIcon}
                    >
                      <Popup>
                        <div className="text-sm p-2">
                          <div className="font-bold text-lg mb-2">{mission.asset_id}</div>
                          <div className="space-y-1">
                            <div>Status: <span className="font-semibold">{mission.asset_status}</span></div>
                            <div>Type: {mission.asset_type}</div>
                            <div className="text-xs text-gray-600 mt-2">
                              En route to {mission.target_station}
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Target location */}
                    <Marker
                      position={[mission.target_lat, mission.target_lon]}
                      icon={targetIcon}
                    >
                      <Popup>
                        <div className="text-sm p-2">
                          <div className="font-bold text-lg mb-2">{mission.target_station}</div>
                          <div className={`${getUrgencyColor(mission.urgency_level)} text-white px-2 py-1 rounded text-xs font-bold mb-2`}>
                            {mission.urgency_level} PRIORITY
                          </div>
                          <div className="space-y-1">
                            <div>Predicted PM2.5: <span className="font-bold">{mission.predicted_pm25}</span></div>
                            <div>Predicted AQI: <span className="font-bold">{mission.predicted_aqi}</span></div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Route line */}
                    <Polyline
                      positions={[
                        [mission.asset_current_lat, mission.asset_current_lon],
                        [mission.target_lat, mission.target_lon]
                      ]}
                      color={mission.urgency_level === 'CRITICAL' ? '#DC2626' : mission.urgency_level === 'HIGH' ? '#F59E0B' : '#3B82F6'}
                      weight={selectedMission === mission.ticket_id ? 5 : 3}
                      opacity={selectedMission === mission.ticket_id ? 1 : 0.7}
                      dashArray="10, 10"
                    />
                  </React.Fragment>
                ))}

                {/* Plot idle assets */}
                {fleetStatus?.assets
                  .filter(asset => asset.status === 'IDLE')
                  .map((asset) => (
                    <Marker
                      key={asset.asset_id}
                      position={asset.location}
                      icon={idleIcon}
                    >
                      <Popup>
                        <div className="text-sm p-2">
                          <div className="font-bold text-lg mb-2">{asset.asset_id}</div>
                          <div className="space-y-1">
                            <div>Status: <span className="text-green-600 font-semibold">IDLE</span></div>
                            <div>Home: {asset.home_station}</div>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                              <div>
                                <div className="text-gray-600">Water</div>
                                <div className="font-bold">{asset.water_level}%</div>
                              </div>
                              <div>
                                <div className="text-gray-600">Fuel</div>
                                <div className="font-bold">{asset.fuel_level}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="fixed bottom-6 right-6 flex gap-3 z-[1000]">
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`${
            autoRefresh ? 'bg-status-safe' : 'bg-metal'
          } text-white px-6 py-3 rounded-full shadow-card hover:opacity-90 transition font-semibold`}
        >
          {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
        </button>
        
        <button
          onClick={initializeDemo}
          className="bg-primary text-white px-6 py-3 rounded-full shadow-card hover:bg-primary-700 transition font-semibold"
        >
          🔄 Reinitialize Demo
        </button>
      </div>
      </div>
    </div>
  );
};

export default DispatchDashboard;
