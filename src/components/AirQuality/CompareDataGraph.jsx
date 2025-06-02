import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Select from "react-select";
import { getBaseUrl } from "../Connectivity/storageHelper";

const Component6 = () => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);

  // Selected Option (Pollutant)
  const [selectedOption, setSelectedOption] = useState("AQI");
  // Available pollutant options
  const options = ["CO", "NO2", "OZONE", "SO2", "AQI", "PM10", "NH3"];

  // City and Compare City (for the D3 chart)
  const [city, setCity] = useState(null);
  const [compareCity, setCompareCity] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("last-7-days");

  // Options to be loaded into the Select components
  const [cityOptions, setCityOptions] = useState([]);
  const [compareCityOptions, setCompareCityOptions] = useState([]);

  // Additional filtering options
  const filterOptions = ["last-7-days", "last-15-days", "last-30-days"];

  // Data returned from fetch calls
  const [rawdata, setRawdata] = useState([]);
  const [compareRawdata, setCompareRawdata] = useState([]);

  // Track best/worst values for the selected pollutant
  const [bestValue, setBestValue] = useState(null);
  const [worstValue, setWorstValue] = useState(null);
  const [bestCity, setBestCity] = useState(null);
  const [worstCity, setWorstCity] = useState(null);
  const [bestDate, setBestDate] = useState(null);
  const [worstDate, setWorstDate] = useState(null);

  // Fetch city/station options from API
  const fetchCityOptions = async () => {
    try {
      const baseUrl = getBaseUrl();
      const url = `${baseUrl}get-allStations`;
      console.log("Fetching station options from:", url);

      const response = await fetch(url);
      if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Raw station data:", data);

      // Map fetched data to format expected by React Select
      const cities = data.map((item) => ({
        label: item.Station,
        value: item.Station,
      }));
      console.log("Formatted city options:", cities);

      setCityOptions(cities);
      setCompareCityOptions(cities);
    } catch (error) {
      console.error("Error fetching city options:", error);
    }
  };

  // On component mount, get the city/station options
  useEffect(() => {
    fetchCityOptions();
  }, []);

  // Fetch data for the selected primary city and comparison city
  const fetchData = async () => {
    console.log("fetchData called with:", {
      city,
      compareCity,
      selectedOption,
      selectedTimeRange,
    });

    if (!city && !compareCity) {
      console.log("No city/compareCity selected, clearing data.");
      setRawdata([]);
      setCompareRawdata([]);
      return;
    }

    const toDate =
      selectedTimeRange === "last-7-days"
        ? 6
        : selectedTimeRange === "last-15-days"
        ? 14
        : 29;

    const baseUrl = getBaseUrl();

    // Fetch data for the primary city
    if (city) {
      const apiUrl = `${baseUrl}get-GraphData/?pol_City=${city.value}&to_date=${toDate}`;
      console.log("Fetching data for city from:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log("Data received for city:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("Sample data point:", data[0]);
        }
        setRawdata(data);
      } catch (error) {
        console.error("Error fetching graph data for city:", error);
      }
    } else {
      setRawdata([]);
    }

    // Fetch data for the comparison city
    if (compareCity) {
      const compareApiUrl = `${baseUrl}get-GraphData/?pol_City=${compareCity.value}&to_date=${toDate}`;
      console.log("Fetching data for compare city from:", compareApiUrl);

      try {
        const response = await fetch(compareApiUrl);
        const data = await response.json();
        console.log("Data received for compare city:", data);
        if (Array.isArray(data) && data.length > 0) {
          console.log("Sample compare data point:", data[0]);
        }
        setCompareRawdata(data);
      } catch (error) {
        console.error("Error fetching compare graph data:", error);
      }
    } else {
      setCompareRawdata([]);
    }
  };

  // Refetch data whenever relevant dropdown or time range changes
  useEffect(() => {
    fetchData();
  }, [city, compareCity, selectedOption, selectedTimeRange]);

  // Compute best/worst values for the currently selected pollutant
  useEffect(() => {
    console.log("Calculating best/worst for selectedOption:", selectedOption);
    console.log("Current rawdata:", rawdata);
    console.log("Current compareRawdata:", compareRawdata);

    if ((!rawdata.length && !compareRawdata.length) || !selectedOption) {
      setBestValue(null);
      setWorstValue(null);
      setBestCity(null);
      setWorstCity(null);
      setBestDate(null);
      setWorstDate(null);
      return;
    }

    // Combine both datasets and ensure values are numeric
    const allData = [...rawdata, ...compareRawdata];
    const validData = allData.filter(d => {
      const value = Number(d[selectedOption]);
      return !isNaN(value) && value !== null && value !== undefined;
    });

    if (!validData.length) {
      setBestValue("No valid data");
      setWorstValue("No valid data");
      setBestCity(null);
      setWorstCity(null);
      setBestDate(null);
      setWorstDate(null);
      return;
    }

    // Convert string values to numbers for comparison and find best/worst
    const bestData = validData.reduce((acc, cur) => 
      Number(acc[selectedOption]) < Number(cur[selectedOption]) ? acc : cur
    );
    const worstData = validData.reduce((acc, cur) => 
      Number(acc[selectedOption]) > Number(cur[selectedOption]) ? acc : cur
    );

    // Format values and set all related state
    setBestValue(Number(bestData[selectedOption]).toFixed(2));
    setWorstValue(Number(worstData[selectedOption]).toFixed(2));
    setBestCity(bestData.City);
    setWorstCity(worstData.City);
    setBestDate(new Date(bestData.Pol_Date).toLocaleDateString());
    setWorstDate(new Date(worstData.Pol_Date).toLocaleDateString());

  }, [rawdata, compareRawdata, selectedOption]);

  // D3 chart rendering logic (unchanged)
  useEffect(() => {
    console.log("D3 chart rendering with rawdata:", rawdata);
    console.log("D3 chart rendering with compareRawdata:", compareRawdata);

    if (!rawdata.length && !compareRawdata.length) {
      d3.select(chartRef.current).selectAll("*").remove();
      return;
    }

    // Rest of your existing D3 chart code...
    // [Previous D3 chart code remains exactly the same]

  }, [rawdata, compareRawdata, selectedOption, city, compareCity]);

  // Handlers for form elements
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleCityChange = (selectedOption) => {
    console.log("Selected primary city:", selectedOption);
    setCity(selectedOption);
  };

  const handleCompareCityChange = (selectedOption) => {
    console.log("Selected compare city:", selectedOption);
    setCompareCity(selectedOption);
  };

  const handleTimeRangeChange = (e) => {
    setSelectedTimeRange(e.target.value);
  };

  return (
    <div className="mx-4 my-4 flex flex-col">
      <div className="flex flex-col lg:flex-row lg:justify-between">
        <div>
          <h1 className="text-2xl text-[#33a0d3]">Historic Air Quality Data</h1>
          <div className="mt-2 text-xs text-slate-500">
            <span>Explore insightful air pollution data for:</span>
            <ul className="list-disc mt-1 ml-4">
              <li>Last 7 days</li>
              <li>Last 15 days</li>
              <li>Last 30 days</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-2 lg:mt-0">
          <div className="best bg-green-500 text-white rounded-lg p-2 flex flex-col justify-center items-center min-w-[200px]">
            <span className="text-xs font-semibold">Best {selectedOption}</span>
            <h3 className="text-lg font-bold">{bestValue || 'No data'}</h3>
            {bestCity && bestDate && (
              <span className="text-xs">
                {bestCity} - {bestDate}
              </span>
            )}
          </div>
          <div className="worst bg-red-500 text-white rounded-lg p-2 flex flex-col justify-center items-center min-w-[200px]">
            <span className="text-xs font-semibold">Worst {selectedOption}</span>
            <h3 className="text-lg font-bold">{worstValue || 'No data'}</h3>
            {worstCity && worstDate && (
              <span className="text-xs">
                {worstCity} - {worstDate}
              </span>
            )}
          </div>
        </div>
      </div>

      <div>
        <div className="lg:flex lg:flex-row grid grid-cols-2 items-center mb-5">
          <select
            className="border border-gray-300 p-2 rounded-md mt-3"
            onChange={handleChange}
            value={selectedOption}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            className="border border-gray-300 p-2 rounded-md mt-3 ml-3"
            value={selectedTimeRange}
            onChange={handleTimeRangeChange}
          >
            {filterOptions.map((filterOption) => (
              <option key={filterOption} value={filterOption}>
                {filterOption}
              </option>
            ))}
          </select>

          <Select
            className="border border-gray-300 rounded-md mt-3 ml-3"
            options={cityOptions}
            value={city}
            onChange={handleCityChange}
            isClearable
            placeholder="Select City"
          />

          <Select
            className="border border-gray-300 rounded-md mt-3 ml-3"
            options={compareCityOptions}
            value={compareCity}
            onChange={handleCompareCityChange}
            isClearable
            placeholder="Compare with City"
          />
        </div>

        <svg ref={chartRef}></svg>

        <div
          className="tooltip"
          ref={tooltipRef}
          style={{
            position: "absolute",
            backgroundColor: "white",
            border: "1px solid #ddd",
            padding: "5px",
            borderRadius: "5px",
            display: "none",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Component6;