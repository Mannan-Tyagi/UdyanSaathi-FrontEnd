// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from 'react';
import { getUrl, setTodayDate } from '../Connectivity/storageHelper';
import AnimatedBackground from '../animations/AnimatedBackground';
// import AnimatedBackground from '../animations/AnimatedBackground';

const AqiDetails = ({selectedSearch}) => {
  const [state, setState] = useState({
    value: 60,
    color: 'transparent',
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
      // console.log('DATA:', data);
      setPollution(data);

      if (data.length > 0) {
        const firstEntry = data[0];
        setState((prevState) => ({
          ...prevState,
          value: firstEntry.AQI,
          color: getColorForValue(firstEntry.AQI),
        }));
        setTodayDate(firstEntry.Pol_Date);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // EPA/CPCB Standard AQI Color Scale (synchronized with ward comparison)
  const getColorForValue = (value) => {
    if (value <= 50) {
      return '#00e400';  // Good (Green)
    } else if (value <= 100) {
      return '#ffff00';  // Satisfactory (Yellow)
    } else if (value <= 150) {
      return '#ff7e00';  // Moderate (Orange)
    } else if (value <= 200) {
      return '#ff0000';  // Poor (Red)
    } else if (value <= 300) {
      return '#8f3f97';  // Very Poor (Purple)
    } else {
      return '#7e0023';  // Severe (Maroon)
    }
  };

  return (
    <div className="relative rounded-2xl h-full">
      <div className="absolute inset-0 rounded-2xl">
        <AnimatedBackground />
      </div>
      {pollution.map((pol) => (
        <div key={pol.id} className="lg:p-12 p-8 rounded-2xl relative z-10 flex flex-col">
          <div className="mb-11">
            <h1 className="lg:text-5xl text-2xl mb-3">{pol.Station}</h1>
            <p className="text-slate-500 lg:text-lg text-xs">
              Real-time PM2.5, PM10 air pollution level {pol.State}
            </p>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col justify-center gap-1">
              <p className="text-slate-500 lg:text-lg text-xs">
                Last Update: {pol.Pol_Date}
              </p>
              <button
                style={{ background: state.color }}
                className="Warning p-1 rounded-3xl px-3 mt-2 text-white lg:text-xl text-sm mr-14"
              >
                {pol.AQI_Quality}
              </button>
            </div>
            <div className="p2 mx-auto flex flex-col items-center">
              <h1
                style={{ color: state.color }}
                className="lg:-mr-44 lg:ml-12 ml-6 lg:text-9xl text-6xl font-bold"
              >
                {pol.AQI}
              </h1>
              <p className="lg:-mr-44 lg:ml-12 ml-6 text-slate-600">(AQI)</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AqiDetails;
