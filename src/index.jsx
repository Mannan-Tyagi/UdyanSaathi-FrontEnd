import React from "react";
import ReactDOM from "react-dom/client";
import AirQualityPage from "./pages/AirQualityPage";
import WeatherMoniter from "./pages/WeatherMoniter";
import WaterQualiity from "./pages/WaterQualiity";
import DispatchDashboard from "./components/Dispatch/DispatchDashboard";
import WardComparison from "./components/Wards/WardComparison";
import WardPolicySimulator from "./components/Wards/WardPolicySimulator";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('❌ Service Worker registration failed:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AirQualityPage />} />
          <Route path="/water-quality-index" element={<WaterQualiity />} /> 
          <Route path="/weather" element={<WeatherMoniter />} />
          <Route path="/dispatch" element={<DispatchDashboard />} />
          <Route path="/wards" element={<WardComparison />} />
          <Route path="/policy-simulator" element={<WardPolicySimulator />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
