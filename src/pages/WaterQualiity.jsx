/*
 * ============================================
 * WATER QUALITY FEATURE - CURRENTLY DISABLED
 * ============================================
 * This component and all related Water Quality features are currently commented out
 * and not being displayed in the frontend. No changes should be made to this file
 * or any WaterQuality components until the feature is re-enabled.
 * 
 * Related files (all disabled):
 * - src/components/WaterQuality/WaterComponent1.jsx through WaterComponent8.jsx
 * - src/components/navbar/navbar(WQI).jsx
 * - Route: /water-quality-index (commented out in src/index.jsx)
 * ============================================
 */

import React from "react";
import Navbar from "../components/navbar/navbar(WQI)";
import WaterComponent1 from "../components/WaterQuality/WaterComponent1";
import WaterComponent2 from "../components/WaterQuality/WaterComponent2";
import WaterComponent3 from "../components/WaterQuality/WaterComponent3";
import WaterComponent4 from "../components/WaterQuality/WaterComponent4";
import WaterComponent5 from "../components/WaterQuality/WaterComponent5";
import WaterComponent6 from "../components/WaterQuality/WaterComponent6";
import WaterComponent7 from "../components/WaterQuality/WaterComponent7";
import WaterComponent8 from "../components/WaterQuality/WaterComponent8";

const WaterQualiity = () => {
  return (
    <>
      <Navbar />
      <div className="home-row-1 m-5 flex flex-row relative">
        <div className="C1 m-3 rounded-2xl s">
          <WaterComponent1 />
        </div>
        <div className="C2 m-3 relative rounded-2xl">
          <WaterComponent2 />
        </div>
      </div>
      <div className="home-row-2 flex flex-row relative m-5">
        <div className="C3 m-3 rounded-2xl bg-white">
          <WaterComponent3 />
        </div>
        <div className="C4 m-3 rounded-2xl bg-white">
          <WaterComponent4 />
        </div>
      </div>
      <div className="home-row-3 flex flex-row relative m-5">
        <div className="C5 m-3 rounded-2xl bg-white">
          <WaterComponent5 />
        </div>
        <div className="C6 m-3 rounded-2xl bg-white">
          <WaterComponent6 />
        </div>
      </div>
      <div className="home-row-4 flex flex-row relative m-5">
        <div className="C7 m-3 rounded-2xl bg-white">
          <WaterComponent7 />
        </div>
      </div>
      <div className="home-row-5 flex flex-row relative m-5">
        <div className="C8 m-3 rounded-2xl bg-white ">
          <WaterComponent8 />
        </div>
      </div>
    </>
  );
};

export default WaterQualiity;
