import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getBaseUrl, setStationName, setUrl } from "../Connectivity/storageHelper";

/**
 * Smart City Glass & Grid Design System - Navbar
 * Clean, minimal navigation with Udyan Teal brand color
 */
function Navbar({ onSearchSelected }) {
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

  // Navigation items
  const navItems = [
    { path: "/", label: "Air Quality", icon: "🌬️" },
    { path: "/weather", label: "Weather", icon: "☀️" },
  ];

  // Feature items
  const featureItems = [
    { path: "/wards", label: "Wards", icon: "🏙️" },
    { path: "/policy-simulator", label: "Policy Sim", icon: "🎛️" },
    { path: "/dispatch", label: "Dispatch", icon: "🚨" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main Navbar with Glassmorphic Effect - Always Visible on Scroll */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-2xl shadow-xl border-b border-white/30'
            : 'bg-white/75 backdrop-blur-xl border-b border-white/20'
        }`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backdropFilter: isScrolled ? 'blur(24px) saturate(200%)' : 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: isScrolled ? 'blur(24px) saturate(200%)' : 'blur(20px) saturate(180%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-10 h-10 bg-gradient-to-br from-primary to-teal-600 rounded-xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow"
              >
                <span className="text-white text-lg">🌿</span>
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-primary to-teal-600 bg-clip-text text-transparent">
                  UdyanSaathi
                </span>
                <span className="block text-[10px] text-gray-600 font-medium -mt-1">
                  Environmental Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Main Nav Items */}
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-6 bg-gray-300/50 mx-2" />

              {/* Feature Items */}
              {featureItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Search with Glassmorphic Effect */}
            <div className="hidden md:block relative">
              <motion.div
                animate={{ width: isSearchFocused ? 280 : 220 }}
                className="relative"
              >
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full pl-10 pr-4 py-2 bg-white/50 backdrop-blur-md border border-white/50 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary focus:bg-white/70 transition-all duration-200 shadow-sm"
                  style={{
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                  }}
                />
              </motion.div>

              {/* Search Suggestions with Glassmorphic Effect */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/50 max-h-64 overflow-y-auto z-50"
                    style={{
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-3 hover:bg-white/70 cursor-pointer text-sm text-gray-900 border-b border-gray-200/50 last:border-0 flex items-center gap-2 transition-all"
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
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-white/60 backdrop-blur-sm transition-colors text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu with Glassmorphic Effect */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-white/30"
              style={{
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              }}
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Search with Glass Effect */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search station..."
                    value={searchTerm}
                    onChange={(e) => updateSuggestions(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-md border border-white/50 rounded-xl text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary shadow-sm"
                    style={{
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                    }}
                  />
                  <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Mobile Nav Items */}
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 transition-all ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-md'
                        : 'text-gray-700 hover:bg-white/70 backdrop-blur-sm'
                    }`}>
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}

                <div className="border-t border-gray-300/50 my-3 pt-3">
                  {featureItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 mb-2 transition-all ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-primary to-teal-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-white/70 backdrop-blur-sm'
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
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-16" />
    </>
  );
}

export default Navbar;
