import React, { useEffect, useState } from "react";
import { getBaseUrl } from "../Connectivity/storageHelper";

const Component7 = () => {
  const [AQIdata, setAQIdata] = useState([]);
  const [timeRange, setTimeRange] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseurl = getBaseUrl();
        const response = await fetch(`${baseurl}get-MetroCityData/?to_date=${timeRange}`);
        const data = await response.json();
        setAQIdata(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [timeRange]);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const getIconPath = (city) => {
    return `/icons/${city}.svg`;
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-semibold text-primary text-start mb-2">Historical Average Air Quality Data Of Metropolitan Cities</h1>
      <p className="text-sm text-metal mb-4">Details about Pollutant in metropolitan cities</p>

      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="timeRange" className="text-sm text-metal">Select Time Range:</label>
        <select id="timeRange" value={timeRange} onChange={handleTimeRangeChange} className="select-input">
          <option value="0">Last Day</option>
          <option value="6">Last 7 Days</option>
          <option value="14">Last 15 Days</option>
          <option value="29">Last 30 Days</option>
        </select>
      </div>
      <div className="overflow-auto">
      <table className="data-table w-full">
        <thead>
          <tr>
            <th>City</th>
            <th>CO</th>
            <th>NH3</th>
            <th>NO2</th>
            <th>OZONE</th>
            <th>PM25</th>
            <th>PM10</th>
            <th>SO2</th>
            <th>AQI</th>
          </tr>
        </thead>
        <tbody>
          {AQIdata.map((item, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap">
                <div className="flex items-center">
                  <img src={getIconPath(item.City)} alt={`${item.City} icon`} className="w-7 h-7 mr-2" />
                  <span className="font-medium text-ink">{item.City}</span>
                </div>
              </td>
              <td>{item.CO}</td>
              <td>{item.NH3}</td>
              <td>{item.NO2}</td>
              <td>{item.OZONE}</td>
              <td>{item.PM25}</td>
              <td>{item.PM10}</td>
              <td>{item.SO2}</td>
              <td className="font-semibold">{item.AQI}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default Component7;
