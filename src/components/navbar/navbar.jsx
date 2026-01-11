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
    { path: "/", label: "Air Quality" },
    { path: "/weather", label: "Weather" },
  ];

  // Feature items
  const featureItems = [
    { path: "/wards", label: "Wards" },
    { path: "/policy-simulator", label: "Policy Sim" },
    { path: "/dispatch", label: "Dispatch" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Main Navbar - Clean and Minimal */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/98 backdrop-blur-sm shadow-sm border-b border-gray-200'
            : 'bg-white/95 backdrop-blur-sm border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-80">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg font-semibold text-gray-900 tracking-tight">
                  UdyanSaathi
                </span>
                <span className="block text-[9px] text-gray-500 font-medium -mt-0.5 tracking-wide">ENVIRONMENTAL INTELLIGENCE</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {/* Main Nav Items */}
              {navItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}

              {/* Divider */}
              <div className="w-px h-5 bg-gray-200 mx-3" />

              {/* Feature Items */}
              {featureItems.map((item) => (
                <Link key={item.path} to={item.path}>
                  <div
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-teal-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Search */}
            <div className="hidden md:block relative">
              <div className="relative" style={{ width: isSearchFocused ? '280px' : '220px', transition: 'width 200ms ease' }}>
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-50"
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => selectSuggestion(suggestion)}
                        className="px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 border-b border-gray-100 last:border-0 transition-colors"
                      >
                        {suggestion}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search station..."
                    value={searchTerm}
                    onChange={(e) => updateSuggestions(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                  <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Mobile Nav Items */}
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      isActive(item.path)
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>
                      <span>{item.label}</span>
                    </div>
                  </Link>
                ))}

                <div className="border-t border-gray-200 my-3 pt-3">
                  {featureItems.map((item) => (
                    <Link key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <div className={`px-4 py-2.5 rounded-lg font-medium text-sm mb-2 transition-colors ${
                        isActive(item.path)
                          ? 'bg-teal-600 text-white'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}>
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
