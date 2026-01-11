// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUrl, setTodayDate } from '../Connectivity/storageHelper';

/**
 * Smart City Glass & Grid Design System - AQI Details Card
 * Premium Dashboard Style
 */
const AqiDetails = ({selectedSearch}) => {
  const [state, setState] = useState({
    value: 60,
    color: 'transparent',
    gradient: 'from-gray-400 to-gray-500'
  });

  const [pollution, setPollution] = useState([]);

  useEffect(() => {
    getPollutionData();
  },[selectedSearch]);

  const getPollutionData = async () => {
    try {
      const apiurl = getUrl();
      const response = await fetch(apiurl);
      const data = await response.json();
      setPollution(data);

      if (data.length > 0) {
        const firstEntry = data[0];
        const colorData = getColorForValue(firstEntry.AQI);
        setState((prevState) => ({
          ...prevState,
          value: firstEntry.AQI,
          color: colorData.color,
          gradient: colorData.gradient
        }));
        setTodayDate(firstEntry.Pol_Date);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // EPA/CPCB Standard AQI Color Scale with gradients
  const getColorForValue = (value) => {
    if (value <= 50) {
      return { color: '#10B981', gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500' };
    } else if (value <= 100) {
      return { color: '#F59E0B', gradient: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500' };
    } else if (value <= 150) {
      return { color: '#F97316', gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-500' };
    } else if (value <= 200) {
      return { color: '#EF4444', gradient: 'from-red-400 to-rose-500', bg: 'bg-red-500' };
    } else if (value <= 300) {
      return { color: '#8B5CF6', gradient: 'from-purple-400 to-violet-500', bg: 'bg-purple-500' };
    } else {
      return { color: '#991B1B', gradient: 'from-red-600 to-rose-700', bg: 'bg-red-800' };
    }
  };

  // Get quality badge style
  const getQualityBadgeClass = (aqi) => {
    if (aqi <= 50) return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
    if (aqi <= 100) return 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white';
    if (aqi <= 150) return 'bg-gradient-to-r from-orange-500 to-amber-500 text-white';
    if (aqi <= 200) return 'bg-gradient-to-r from-red-500 to-rose-500 text-white';
    if (aqi <= 300) return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
    return 'bg-gradient-to-r from-red-700 to-rose-800 text-white';
  };

  const getQualityDescription = (aqi) => {
    if (aqi <= 50) return 'Air quality is satisfactory';
    if (aqi <= 100) return 'Acceptable air quality';
    if (aqi <= 150) return 'Sensitive groups may be affected';
    if (aqi <= 200) return 'Health effects for everyone';
    if (aqi <= 300) return 'Health alert: serious effects';
    return 'Emergency conditions';
  };

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden">
      {pollution.map((pol) => (
        <div key={pol.id} className="p-6 lg:p-8 flex flex-col h-full">
          
          {/* Top Section - Station Info */}
          <div className="mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight mb-1">
                  {pol.Station}
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  {pol.City}, {pol.State}
                </p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-semibold text-gray-600">LIVE</span>
              </div>
            </div>
          </div>

          {/* Main AQI Display */}
          <div className="flex-1 flex items-center justify-between gap-6">
            
            {/* Left - Status Info */}
            <div className="flex flex-col gap-4">
              {/* Quality Badge */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className={`px-5 py-2.5 rounded-xl text-sm font-bold inline-block shadow-lg ${getQualityBadgeClass(pol.AQI)}`}>
                  {pol.AQI_Quality}
                </span>
              </motion.div>
              
              {/* Quality Description */}
              <p className="text-gray-600 text-sm font-medium max-w-[200px]">
                {getQualityDescription(pol.AQI)}
              </p>
              
              {/* Last Update */}
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{pol.Pol_Date}</span>
              </div>
            </div>

            {/* Right - AQI Circle */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* Glow Effect */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${state.gradient} rounded-full blur-2xl opacity-30 scale-110`}
              ></div>
              
              {/* Main Circle */}
              <div 
                className={`relative w-36 h-36 lg:w-44 lg:h-44 rounded-full bg-gradient-to-br ${state.gradient} flex flex-col items-center justify-center shadow-2xl`}
              >
                {/* Inner Ring */}
                <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm"></div>
                
                {/* AQI Value */}
                <span className="relative text-5xl lg:text-6xl font-black text-white drop-shadow-lg">
                  {pol.AQI}
                </span>
                <span className="relative text-white/90 text-sm font-bold uppercase tracking-wider mt-1">
                  AQI
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AqiDetails;
