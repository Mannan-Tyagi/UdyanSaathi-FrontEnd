// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUrl, setTodayDate } from '../Connectivity/storageHelper';

/**
 * AQI Details Card - Inspired by Purwokerto Design (Image 3)
 * Features: Status badge, circular gauge, clean typography
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
      return { color: '#48BB78', gradient: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-500', label: 'Good', emoji: '😊' };
    } else if (value <= 100) {
      return { color: '#ECC94B', gradient: 'from-amber-400 to-yellow-500', bg: 'bg-amber-500', label: 'Satisfactory', emoji: '🙂' };
    } else if (value <= 150) {
      return { color: '#ED8936', gradient: 'from-orange-400 to-amber-500', bg: 'bg-orange-500', label: 'Moderate', emoji: '😐' };
    } else if (value <= 200) {
      return { color: '#F56565', gradient: 'from-red-400 to-rose-500', bg: 'bg-red-500', label: 'Poor', emoji: '😷' };
    } else if (value <= 300) {
      return { color: '#9F7AEA', gradient: 'from-purple-400 to-violet-500', bg: 'bg-purple-500', label: 'Very Poor', emoji: '🤢' };
    } else {
      return { color: '#C53030', gradient: 'from-red-600 to-rose-700', bg: 'bg-red-800', label: 'Severe', emoji: '☠️' };
    }
  };

  // Get badge class based on AQI
  const getBadgeClass = (aqi) => {
    if (aqi <= 50) return 'aqi-badge-good';
    if (aqi <= 100) return 'aqi-badge-satisfactory';
    if (aqi <= 150) return 'aqi-badge-moderate';
    if (aqi <= 200) return 'aqi-badge-poor';
    if (aqi <= 300) return 'aqi-badge-very-poor';
    return 'aqi-badge-severe';
  };

  // Calculate gauge rotation based on AQI (0-500 scale to 0-180 degrees)
  const getGaugeRotation = (aqi) => {
    const clampedAqi = Math.min(Math.max(aqi, 0), 500);
    return (clampedAqi / 500) * 180;
  };

  return (
    <div className="relative h-full min-h-[320px] overflow-hidden">
      {pollution.map((pol) => {
        const colorData = getColorForValue(pol.AQI);
        
        return (
          <div key={pol.id} className="p-6 lg:p-8 flex flex-col h-full">
            
            {/* Top Section - Status Badge */}
            <div className="flex items-start justify-between mb-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getBadgeClass(pol.AQI)}`}>
                  <span>{colorData.emoji}</span>
                  <span>{colorData.label}</span>
                </span>
              </motion.div>
              
              {/* Live Indicator */}
              <div className="flex items-center gap-2 text-xs text-metal">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="font-medium">LIVE</span>
              </div>
            </div>

            {/* Location Info */}
            <div className="mb-6">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-ink leading-tight mb-1">
                {pol.Station}
              </h1>
              <p className="text-metal text-sm flex items-center gap-2">
                <span className="text-lg">📍</span>
                {pol.City}, {pol.State}
              </p>
            </div>

            {/* Main Content - AQI Display */}
            <div className="flex items-center justify-between flex-1">
              
              {/* Left - Description */}
              <div className="flex flex-col gap-4 max-w-[200px]">
                <p className="text-metal text-sm leading-relaxed">
                  {pol.AQI <= 50 && "Air quality is satisfactory with minimal pollution risk."}
                  {pol.AQI > 50 && pol.AQI <= 100 && "Acceptable air quality for most individuals."}
                  {pol.AQI > 100 && pol.AQI <= 150 && "Sensitive groups may experience mild effects."}
                  {pol.AQI > 150 && pol.AQI <= 200 && "Health effects possible for everyone."}
                  {pol.AQI > 200 && pol.AQI <= 300 && "Health alert: serious effects possible."}
                  {pol.AQI > 300 && "Emergency conditions - avoid outdoor activities."}
                </p>
                
                {/* Last Update */}
                <div className="flex items-center gap-2 text-muted text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{pol.Pol_Date}</span>
                </div>
              </div>

              {/* Right - Circular AQI Gauge */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="relative"
              >
                {/* Gauge Container */}
                <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                  {/* Background Ring with gradient */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#48BB78" />
                        <stop offset="25%" stopColor="#ECC94B" />
                        <stop offset="50%" stopColor="#ED8936" />
                        <stop offset="75%" stopColor="#F56565" />
                        <stop offset="100%" stopColor="#C53030" />
                      </linearGradient>
                    </defs>
                    {/* Background track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="198"
                      strokeDashoffset="66"
                    />
                    {/* Progress arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#gaugeGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="198"
                      strokeDashoffset={198 - (pol.AQI / 500) * 132}
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span 
                      className="text-4xl lg:text-5xl font-extrabold"
                      style={{ color: colorData.color }}
                    >
                      {pol.AQI}
                    </span>
                    <span className="text-xs font-semibold text-metal uppercase tracking-wider">
                      AQI
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quality Label at bottom */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-4 pt-4 border-t border-mist"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">{pol.AQI_Quality}</span>
                <span className="text-xs text-metal">India AQI Scale</span>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default AqiDetails;
