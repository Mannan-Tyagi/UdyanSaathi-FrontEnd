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
      maxPollutant = { level: "Danger", message: "Ozone levels unhealthy.", chemical: "Ozone", amount: OZONE };
    }
    if (CO > 10) {
      maxPollutant = { level: "Danger", message: "CO dangerously high.", chemical: "CO", amount: CO };
    }
    if (PM10 > 250 || PM25 > 90) {
      const maxPM = PM10 > PM25 ? PM10 : PM25;
      maxPollutant = { level: "Danger", message: "PM hazardous.", chemical: "PM", amount: maxPM };
    }
    if (NO2 > 180) {
      maxPollutant = { level: "Danger", message: "NO2 very high.", chemical: "NO2", amount: NO2 };
    }
    if (SO2 > 380) {
      maxPollutant = { level: "Danger", message: "SO2 exceeds limits.", chemical: "SO2", amount: SO2 };
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
              <div className="text-left"><p className="text-xs text-metal">Updates</p><p className="text-base font-bold text-ink">Every 15 min</p></div>
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
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-red-200 overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-500 rounded-xl flex items-center justify-center"><span className="text-white text-xl">⚠️</span></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5"><span className="text-red-600 font-bold text-sm">{dangerAlert.level} Alert</span><span className="text-red-500 font-black text-lg">{dangerAlert.amount}</span></div>
                  <p className="text-gray-600 text-xs truncate">{dangerAlert.message}</p>
                </div>
                <button onClick={() => setDangerAlert(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
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
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className="p-4 border-b border-gray-100/80 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </div>
                  <div><h3 className="font-semibold text-ink">Interactive Pollution Map</h3><p className="text-sm text-metal">Click on markers to view station details</p></div>
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

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-6">
            <div className="lg:col-span-4">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500/15 to-red-500/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  </div>
                  <div><span className="font-semibold text-ink block">Most Polluted</span><span className="text-xs text-metal">Top affected areas</span></div>
                </div>
                <Component3 />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/15 to-primary/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <div><span className="font-semibold text-ink block">Health & ML Predictions</span><span className="text-xs text-metal">AI-powered insights</span></div>
                </div>
                <Component4 />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="h-full bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/15 to-green-500/5 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  </div>
                  <div><span className="font-semibold text-ink block">Least Polluted</span><span className="text-xs text-metal">Cleanest areas</span></div>
                </div>
                <Component5 />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm hover:shadow-lg transition-all duration-300 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500/15 to-blue-500/5 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <div><span className="font-semibold text-ink block">Historical Comparison</span><span className="text-xs text-metal">Trend analysis over time</span></div>
              </div>
              <Component6 />
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
