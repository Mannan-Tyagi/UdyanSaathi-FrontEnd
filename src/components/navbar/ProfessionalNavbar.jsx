import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBaseUrl, setStationName, setUrl } from "../Connectivity/storageHelper";

function ProfessionalNavbar({ onSearchSelected }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchStationsData();
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  var stationdata = [];
  const fetchStationsData = async () => {
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}get-MapData`);
      stationdata = await response.json();
      getUserLocation();
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          findNearestStation(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  };

  const findNearestStation = (userLat, userLong) => {
    if (stationdata.length === 0) return;
    let nearestStation = null;
    let minDistance = Number.MAX_VALUE;

    stationdata.forEach((station) => {
      const distance = getDistanceFromLatLonInKm(userLat, userLong, station.Latitude, station.Longitude);
      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = station.Station;
      }
    });

    if (nearestStation) {
      setSearchTerm(nearestStation);
      onSearchSelected(nearestStation);
      performSearch(nearestStation);
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = (deg) => deg * (Math.PI / 180);

  const updateSuggestions = (input) => {
    setSearchTerm(input);
    const filteredSuggestions = defaultSuggestions.filter((suggestion) =>
      suggestion.toLowerCase().includes(input.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const selectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    performSearch(suggestion);
    onSearchSelected(suggestion);
    setIsSearchFocused(false);
  };

  const performSearch = (selectedSuggestion) => {
    const baseUrl = getBaseUrl();
    const endpoint = 'get-pollution-by-date-station/';
    const queryParams = { pol_Station: selectedSuggestion };
    const apiUrl = `${baseUrl}${endpoint}?${new URLSearchParams(queryParams)}`;
    setUrl(apiUrl);
    setStationName(selectedSuggestion);
  };

  useEffect(() => {
    if (searchTerm.length >= 3) {
      const baseUrl = getBaseUrl();
      fetch(`${baseUrl}get-stations/?pol_Station=${searchTerm}`)
        .then(response => response.json())
        .then(data => {
          setDefaultSuggestions(data.map(station => station.Station));
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [searchTerm]);

  const showSuggestions = suggestions.length > 0 && searchTerm !== "" && isSearchFocused;

  const navItems = [
    { path: "/", label: "Air Quality", icon: "🌬️" },
    // { path: "/water-quality-index", label: "Water Quality", icon: "💧" }, // COMMENTED OUT: Water Quality feature disabled
    { path: "/weather", label: "Weather", icon: "☀️" },
  ];

  const featureItems = [
    { path: "/wards", label: "Ward Analysis", icon: "🏙️", gradient: "from-violet-500 to-purple-600" },
    { path: "/policy-simulator", label: "Policy Sim", icon: "🎛️", gradient: "from-emerald-500 to-teal-600" },
    { path: "/dispatch", label: "Dispatch", icon: "🚨", gradient: "from-orange-500 to-red-600" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-surface/95 backdrop-blur-xl shadow-card border-b border-mist'
            : 'bg-surface/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 bg-primary rounded-card flex items-center justify-center shadow-card"
              >
                <span className="text-white text-lg">🌿</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-primary">
                  UdyanSaathi
                </span>
                <span className="block text-[10px] text-metal font-medium -mt-1">Environmental Intelligence</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-card font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-white shadow-card'
                        : 'text-metal hover:text-ink hover:bg-canvas'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              <div className="w-px h-6 bg-mist mx-2" />

              {featureItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-card font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-white shadow-elevation-2'
                        : 'bg-primary/10 text-primary hover:bg-primary/20 shadow-card'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Search */}
            <div className="hidden md:block relative">
              <motion.div
                animate={{ width: isSearchFocused ? 300 : 200 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-metal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search station..."
                  value={searchTerm}
                  onChange={(e) => updateSuggestions(e.target.value)}
                  onFocus={() => { setIsSearchFocused(true); setSearchTerm(''); }}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  className="w-full pl-10 pr-4 py-2 bg-canvas border border-mist rounded-card text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300"
                />
              </motion.div>

              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-surface rounded-card shadow-elevation-2 border border-mist max-h-64 overflow-y-auto z-50"
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-3 hover:bg-primary/10 cursor-pointer text-sm text-ink border-b border-mist last:border-0 flex items-center gap-2"
                      >
                        <span className="text-primary">📍</span>
                        {suggestion}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-card hover:bg-canvas transition-colors"
            >
              <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-surface/98 backdrop-blur-xl border-t border-mist"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search station..."
                    value={searchTerm}
                    onChange={(e) => updateSuggestions(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-canvas border border-mist rounded-card text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <svg className="w-4 h-4 text-metal absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-4 py-3 rounded-card font-medium flex items-center gap-3 ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-ink hover:bg-canvas'
                    }`}>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}

                <div className="border-t border-mist my-3 pt-3">
                  {featureItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-4 py-3 rounded-card font-semibold flex items-center gap-3 mb-2 ${
                        isActive(item.path)
                          ? 'bg-primary text-white shadow-card'
                          : 'bg-primary/10 text-primary'
                      }`}>
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}

export default ProfessionalNavbar;
