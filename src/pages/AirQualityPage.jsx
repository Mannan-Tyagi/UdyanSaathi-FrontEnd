/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/navbar/navbar';
import UnifiedPageBackground from '../components/ui/unified-page-background';
import AqiDetails from "../components/AirQuality/AqiDetails";
import Component2 from "../components/AirQuality/AqiPollutants";
import Component3 from "../components/AirQuality/MostPollutedCities";
import Component4 from "../components/AirQuality/HealthAndMl";
import Component5 from "../components/AirQuality/LeastPollutedCities";
import Component6 from "../components/AirQuality/CompareDataGraph";
import Component7 from "../components/AirQuality/MetroCitiesDetails";
import Component8 from "../components/AirQuality/AqiHeatMap";
import Map from "../components/AirQuality/Map";
import HealthImpact from "../components/AirQuality/HealthImpact";
import { setStationName } from '../components/Connectivity/storageHelper';

function AirQualityPage() {
  const [selectedSearch, setSelectedSearch] = useState('');
  const [dangerAlert, setDangerAlert] = useState(null);
  const [childData, setChildData] = useState(null);

  const handleSearchSelected = (search) => {
    setSelectedSearch(search);
    setStationName(search);
  };

  const handleChildData = (data) => {
    checkPollutionConditions(data);
    setChildData(data);
  };

  const checkPollutionConditions = (data) => {
    const { OZONE, CO, PM10, PM25, NO2, SO2 } = data[0];
    let maxPollutant = null;
    
    if (OZONE > 168) {
      maxPollutant = { 
        level: "Severe Danger", 
        chemical: "Ozone (O₃)", 
        amount: OZONE,
        unit: "μg/m³",
        threshold: 168,
        category: "Hazardous",
        color: "from-red-600 to-rose-600",
        icon: "☁️",
        healthImpact: "Can cause severe respiratory problems, chest pain, and coughing",
        shortTerm: "Avoid all outdoor activities immediately",
        longTerm: "Prolonged exposure causes permanent lung damage",
        recommendations: [
          "Stay indoors with windows and doors closed",
          "Use air purifiers if available",
          "Vulnerable groups should avoid any physical exertion",
          "Wear N95/N99 masks if going outside is unavoidable"
        ],
        affectedGroups: ["Children", "Elderly", "People with respiratory conditions", "Heart disease patients"]
      };
    }
    if (CO > 10) {
      maxPollutant = { 
        level: "Critical Alert", 
        chemical: "Carbon Monoxide (CO)", 
        amount: CO,
        unit: "mg/m³",
        threshold: 10,
        category: "Extremely Dangerous",
        color: "from-orange-600 to-red-600",
        icon: "⚠️",
        healthImpact: "Can cause headaches, dizziness, confusion, and in extreme cases, loss of consciousness",
        shortTerm: "Immediate health risk - evacuate poorly ventilated areas",
        longTerm: "Reduces oxygen delivery to organs and tissues",
        recommendations: [
          "Evacuate enclosed spaces immediately",
          "Seek fresh air and medical attention if feeling unwell",
          "Check for carbon monoxide sources (vehicles, generators)",
          "Do not use gas appliances without proper ventilation"
        ],
        affectedGroups: ["Everyone", "Pregnant women", "People with heart disease", "Anemia patients"]
      };
    }
    if (PM10 > 250 || PM25 > 90) {
      const isPM25 = PM25 > 90;
      const maxPM = isPM25 ? PM25 : PM10;
      const pmType = isPM25 ? "PM2.5" : "PM10";
      maxPollutant = { 
        level: "Hazardous Conditions", 
        chemical: `Particulate Matter (${pmType})`, 
        amount: maxPM,
        unit: "μg/m³",
        threshold: isPM25 ? 90 : 250,
        category: "Severe",
        color: "from-purple-600 to-red-600",
        icon: "🫁",
        healthImpact: `Fine particles penetrate deep into lungs causing inflammation and respiratory distress`,
        shortTerm: "Triggers asthma attacks, bronchitis, and breathing difficulties",
        longTerm: "Increases risk of heart disease, stroke, and lung cancer",
        recommendations: [
          "Cancel all outdoor activities",
          "Keep all windows and doors shut",
          "Run air purifiers on high setting",
          "Wear N95 or higher grade masks if must go outside",
          "Monitor health symptoms closely"
        ],
        affectedGroups: ["Children under 5", "Elderly above 60", "Asthma patients", "COPD patients", "Pregnant women"]
      };
    }
    if (NO2 > 180) {
      maxPollutant = { 
        level: "Health Emergency", 
        chemical: "Nitrogen Dioxide (NO₂)", 
        amount: NO2,
        unit: "μg/m³",
        threshold: 180,
        category: "Very Unhealthy",
        color: "from-amber-600 to-red-600",
        icon: "🏭",
        healthImpact: "Inflames airways causing coughing, wheezing, and difficulty breathing",
        shortTerm: "Aggravates asthma and reduces lung function",
        longTerm: "Increases susceptibility to respiratory infections",
        recommendations: [
          "Limit time spent near traffic and industrial areas",
          "Close windows during rush hours",
          "Use public transport or carpool to reduce emissions",
          "Keep rescue inhalers accessible for asthmatics"
        ],
        affectedGroups: ["Asthma patients", "Children", "Outdoor workers", "Athletes"]
      };
    }
    if (SO2 > 380) {
      maxPollutant = { 
        level: "Extreme Alert", 
        chemical: "Sulfur Dioxide (SO₂)", 
        amount: SO2,
        unit: "μg/m³",
        threshold: 380,
        category: "Hazardous",
        color: "from-yellow-600 to-orange-600",
        icon: "⚡",
        healthImpact: "Causes throat and eye irritation, breathing problems, and bronchospasm",
        shortTerm: "Can trigger severe asthma attacks within minutes",
        longTerm: "Chronic exposure leads to respiratory diseases",
        recommendations: [
          "Avoid areas near industrial facilities",
          "Stay indoors with air conditioning",
          "Keep windows closed to prevent entry",
          "Seek medical help if experiencing breathing difficulties"
        ],
        affectedGroups: ["Asthma sufferers", "People with lung disease", "Children", "Elderly"]
      };
    }
    setDangerAlert(maxPollutant);
  };

  return (
    <UnifiedPageBackground>
      <Navbar onSearchSelected={handleSearchSelected} />

      <section className="min-h-[65vh] md:min-h-[75vh] flex flex-col items-center justify-center px-4 pt-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-primary/20 rounded-full text-sm text-primary font-medium shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Real-time Environmental Monitoring
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-ink">
            Air Quality<span className="block text-primary">Intelligence</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg md:text-xl text-metal max-w-2xl mx-auto">
            Monitor real-time air quality across India with satellite data, ML-powered predictions, and actionable health insights.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div className="text-left"><p className="text-xs text-metal">Monitoring</p><p className="text-base font-bold text-ink">500+ Stations</p></div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div className="text-left"><p className="text-xs text-metal">Updates</p><p className="text-base font-bold text-ink">Every Hour</p></div>
            </div>
            <div className="flex items-center gap-3 px-5 py-3 bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-sm">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div className="text-left"><p className="text-xs text-metal">ML Accuracy</p><p className="text-base font-bold text-ink">94.7%</p></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.5 }} className="pt-8">
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="flex flex-col items-center gap-2 text-metal/50">
              <span className="text-xs font-medium">Scroll to explore</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {dangerAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl"
          >
            <div className="bg-white/98 backdrop-blur-xl rounded-3xl shadow-2xl border border-red-200/50 overflow-hidden">
              {/* Header with Gradient */}
              <div className={`bg-gradient-to-r ${dangerAlert.color} p-5`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl animate-pulse">
                      {dangerAlert.icon}
                    </div>
                    <div className="text-white">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-bold">{dangerAlert.level}</span>
                        <span className="px-2 py-0.5 bg-white/25 backdrop-blur-sm rounded-full text-xs font-semibold">
                          {dangerAlert.category}
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm opacity-90">{dangerAlert.chemical}</span>
                        <span className="text-2xl font-black">{dangerAlert.amount}</span>
                        <span className="text-xs opacity-75">{dangerAlert.unit}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setDangerAlert(null)} 
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* Health Impact */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-bold text-sm">Health Impact</span>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed pl-7">
                    <strong>Immediate:</strong> {dangerAlert.healthImpact}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed pl-7">
                    <strong>Short-term:</strong> {dangerAlert.shortTerm}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed pl-7">
                    <strong>Long-term:</strong> {dangerAlert.longTerm}
                  </p>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-bold text-sm">Recommended Actions</span>
                  </div>
                  <ul className="space-y-1.5 pl-7">
                    {dangerAlert.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700 text-sm">
                        <span className="text-blue-500 mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Affected Groups */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-orange-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-bold text-sm">Most Vulnerable Groups</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-7">
                    {dangerAlert.affectedGroups.map((group, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 rounded-full text-xs font-medium"
                      >
                        {group}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Threshold Info */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Safe Threshold: <strong className="text-gray-700">{dangerAlert.threshold} {dangerAlert.unit}</strong></span>
                    <span className="text-red-600 font-semibold">
                      Exceeded by {Math.round(((dangerAlert.amount - dangerAlert.threshold) / dangerAlert.threshold) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <span className="text-xs text-gray-500">🕐 Updated just now</span>
                <button 
                  onClick={() => setDangerAlert(null)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
                >
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <section className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/40 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-ink">Live Dashboard</h2>
            </div>
            <p className="text-metal ml-4">Real-time air quality metrics and analysis</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
            <div className="lg:col-span-7">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <AqiDetails selectedSearch={selectedSearch} />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <Component2 selectedSearch={selectedSearch} onData={handleChildData} />
              </div>
            </div>
          </motion.div>

          {childData && childData.length > 0 && childData[0]?.PM25 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
              <HealthImpact pm25={childData[0].PM25} />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-ink">Interactive Pollution Map</h3>
                    <p className="text-xs text-metal">Real-time AQI monitoring across India</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-metal bg-canvas px-3 py-1.5 rounded-full border border-mist">
                    <span className="w-1.5 h-1.5 bg-status-good rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
              <Map selectedSearch={selectedSearch} />
            </div>
          </motion.div>
        </section>

        <section className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-500/40 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-ink">Analytics & Insights</h2>
            </div>
            <p className="text-metal ml-4">Comparative analysis and ML-powered predictions</p>
          </motion.div>

          {/* Three-column layout for better space utilization */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left Column - Polluted Cities (stacked) */}
            <div className="lg:col-span-3 flex flex-col gap-5">
              {/* Most Polluted */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-status-critical/10 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-status-critical" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  </div>
                  <div>
                    <span className="font-semibold text-ink text-sm block">Most Polluted</span>
                    <span className="text-[10px] text-metal">Highest AQI cities</span>
                  </div>
                </div>
                <Component3 />
              </div>
              
              {/* Least Polluted */}
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-status-good/10 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-status-good" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div>
                    <span className="font-semibold text-ink text-sm block">Least Polluted</span>
                    <span className="text-[10px] text-metal">Cleanest cities</span>
                  </div>
                </div>
                <Component5 />
              </div>
            </div>

            {/* Right Column - Historical Comparison (takes remaining space) */}
            <div className="lg:col-span-9">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <div>
                    <span className="font-semibold text-ink block">Historical Comparison</span>
                    <span className="text-xs text-metal">Trend analysis over time</span>
                  </div>
                </div>
                <Component6 />
              </div>
            </div>
          </motion.div>

          {/* Health & ML Predictions - Full width below */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-5">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <div>
                    <span className="font-semibold text-ink text-sm block">Health & ML Predictions</span>
                    <span className="text-[10px] text-metal">AI-powered insights & forecasts</span>
                  </div>
                </div>
                <span className="text-[10px] text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">Live</span>
              </div>
              <Component4 />
            </div>
          </motion.div>
        </section>

        <section className="mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-500/40 rounded-full" />
              <h2 className="text-2xl md:text-3xl font-bold text-ink">Metro Cities Overview</h2>
            </div>
            <p className="text-metal ml-4">Air quality across major metropolitan areas</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <Component7 />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-4 border-b border-gray-100/80 bg-gradient-to-r from-orange-500/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-ink">AQI Heat Map</h3><p className="text-sm text-metal">Pollution intensity visualization</p></div>
                </div>
              </div>
              <Component8 selectedSearch={selectedSearch} />
            </div>
          </motion.div>
        </section>

        <motion.footer initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-white/60 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm">
                <span className="flex items-center gap-2 text-metal px-4 py-2 bg-white/70 rounded-full border border-white/80 shadow-sm"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />Live Data</span>
                <span className="flex items-center gap-2 text-metal px-4 py-2 bg-white/70 rounded-full border border-white/80 shadow-sm">🛰️ Sentinel-5P</span>
                <span className="flex items-center gap-2 text-metal px-4 py-2 bg-white/70 rounded-full border border-white/80 shadow-sm">📊 CPCB Data</span>
                <span className="flex items-center gap-2 text-metal px-4 py-2 bg-white/70 rounded-full border border-white/80 shadow-sm">🤖 ML Powered</span>
              </div>
              <p className="text-metal text-sm">© 2025 UdyanSaathi • Environmental Intelligence Platform</p>
            </div>
          </div>
        </motion.footer>
      </main>
    </UnifiedPageBackground>
  );
}

export default AirQualityPage;
