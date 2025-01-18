import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Select from "react-select";
import { getBaseUrl } from "../Connectivity/storageHelper";

const Component6 = () => {
  const chartRef = useRef(null);
  const tooltipRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState("AQI");
  const options = ["CO", "NO2", "OZONE", "SO2", "AQI", "PM10", "NH3"];
  const [city, setCity] = useState(null);
  const [compareCity, setCompareCity] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState("last-7-days");

  const [cityOptions, setCityOptions] = useState([]);
  const [compareCityOptions, setCompareCityOptions] = useState([]);

  const filterOptions = ["last-7-days", "last-15-days", "last-30-days"];

  const [rawdata, setRawdata] = useState([]);
  const [compareRawdata, setCompareRawdata] = useState([]);
  

  const fetchCityOptions = async () => {
    try {
      const baseurl = getBaseUrl();
      const response = await fetch(`${baseurl}get-allStations`);
      const data = await response.json();
      const cities = data.map((item) => ({
        label: item.Station,
        value: item.Station,
      }));
      setCityOptions(cities);
      setCompareCityOptions(cities);
    } catch (error) {
      console.error("Error fetching city options:", error);
    }
  };

  useEffect(() => {
    fetchCityOptions();
  }, []);

  const fetchData = async () => {
    if (!city) return; // Do not fetch if city is not selected

    const toDate =
      selectedTimeRange === "last-7-days"
        ? 6
        : selectedTimeRange === "last-15-days"
        ? 14
        : selectedTimeRange === "last-30-days"
        ? 29
        : 6;
    const baseurl = getBaseUrl();
    const apiUrl = `${baseurl}get-GraphData/?pol_City=${
      city.value
    }&to_date=${toDate}`;
    console.log(apiUrl);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setRawdata(data); // Assuming data structure matches your provided JSON
    } catch (error) {
      console.error("Error fetching graph data:", error);
    }

    if (compareCity) {
      const baseurl = getBaseUrl();
      const compareApiUrl = `${baseurl}get-GraphData/?pol_City=${
        compareCity.value
      }&to_date=${toDate}`;

      try {
        const response = await fetch(compareApiUrl);
        const data = await response.json();
        setCompareRawdata(data); // Assuming data structure matches your provided JSON
      } catch (error) {
        console.error("Error fetching compare graph data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [city, compareCity, selectedOption, selectedTimeRange]);

  const [bestValue, setBestValue] = useState(null);
  const [worstValue, setWorstValue] = useState(null);
//   const [bestValueCompareCity, setBestValueCompareCity] = useState(null);
//   const [worstValueCompareCity, setWorstValueCompareCity] = useState(null);
  
  useEffect(() => {
    if (!rawdata.length ||!compareRawdata.length ||!selectedOption) return;
  
    const allData = [...rawdata,...compareRawdata];
  
    const bestData = allData.reduce((acc, current) => {
      return acc[selectedOption] < current[selectedOption]? acc : current;
    });
  
    const worstData = allData.reduce((acc, current) => {
      return acc[selectedOption] > current[selectedOption]? acc : current;
    });
  
    setBestValue(`${bestData[selectedOption]} (${bestData.City}, ${bestData.Pol_Date})`);
    setWorstValue(`${worstData[selectedOption]} (${worstData.City}, ${worstData.Pol_Date})`);
  }, [rawdata, compareRawdata, selectedOption]);

  useEffect(() => {
    // D3 rendering logic
    if (!rawdata.length || !compareRawdata.length) return; // Do not render if data is not available

    const svg = d3.select(chartRef.current);
    const containerWidth = chartRef.current.parentElement.offsetWidth;
    const margin = { top: 20, right: 20, bottom: 60, left: 50 };
    const width = containerWidth - margin.left - margin.right;
    const height = 370 - margin.top - margin.bottom;

    svg.selectAll("*").remove();

    const x = d3
      .scaleTime()
      .domain(d3.extent(rawdata, (d) => new Date(d.Pol_Date)))
      .range([0, width]);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max([
          d3.max(rawdata, (d) => d[selectedOption]),
          d3.max(compareRawdata, (d) => d[selectedOption]),
        ]),
      ])
      .nice()
      .range([height, 0]);

    const line = d3
      .line()
      .x((d) => x(new Date(d.Pol_Date)))
      .y((d) => y(d[selectedOption]))
      .curve(d3.curveCardinal);

    const area = d3
      .area()
      .x((d) => x(new Date(d.Pol_Date)))
      .y0(height)
      .y1((d) => y(d[selectedOption]))
      .curve(d3.curveCardinal);

    svg.attr("width", width + margin.left + margin.right);
    svg.attr("height", height + margin.top + margin.bottom);

    const g = svg
.append("g")
     .attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
     .call(d3.axisLeft(y))
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", -50)
     .attr("x", -height / 2)
     .attr("dy", "1em")
     .attr("fill", "#000")
     .attr("text-anchor", "middle")
     .text(selectedOption);

    g.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x).ticks(7))
     .append("text")
     .attr("x", width / 2)
     .attr("y", 40)
     .attr("fill", "#000")
     .attr("text-anchor", "middle")
     .text("Date");

    // Render area chart for city data
    g.append("path")
     .datum(rawdata)
     .attr("fill", "#FFB6C1") // Lighter pink for city data
     .attr("opacity", 0.6)
     .attr("d", area);

    // Render line chart for city data
    g.append("path")
     .datum(rawdata)
     .attr("fill", "none")
     .attr("stroke", "#FF69B4") // Pink for city data
     .attr("stroke-linejoin", "round")
     .attr("stroke-linecap", "round")
     .attr("stroke-width", 2)
     .attr("d", line);

    // Render area chart for compare city data
    g.append("path")
     .datum(compareRawdata)
     .attr("fill", "#ADD8E6") // Lighter blue for compare city data
     .attr("opacity", 0.6)
     .attr("d", area);

    // Render line chart for compare city data
    g.append("path")
     .datum(compareRawdata)
     .attr("fill", "none")
     .attr("stroke", "#4682B4") // Blue for compare city data
     .attr("stroke-linejoin", "round")
     .attr("stroke-linecap", "round")
     .attr("stroke-width", 2)
     .attr("d", line);

    const tooltip = d3.select(tooltipRef.current);

    // Render dots for city data
    g.selectAll(".dot")
     .data(rawdata)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("cx", (d) => x(new Date(d.Pol_Date)))
     .attr("cy", (d) => y(d[selectedOption]))
     .attr("r", 5)
     .attr("fill", "#FF69B4")
     .on("mouseover", function (event, d) {
        const { clientX, clientY } = event;

        const tooltipContent = `${selectedOption}: ${d[selectedOption]}<br>Date: ${
          d.Pol_Date
        }<br>City: ${city.label}`;

        d3.select(this).attr("r", 8);

        tooltip
         .style("display", "block")
         .html(tooltipContent)
         .style("left", clientX + 10 + "px")
         .style("top", clientY + -100 + "px");
      })
     .on("mouseout", function () {
        d3.select(this).attr("r", 5);

        tooltip.style("display", "none");
      });

    // Render dots for compare city data
    g.selectAll(".compare-dot")
     .data(compareRawdata)
     .enter()
     .append("circle")
     .attr("class", "compare-dot")
     .attr("cx", (d) => x(new Date(d.Pol_Date)))
     .attr("cy", (d) => y(d[selectedOption]))
     .attr("r", 5)
     .attr("fill", "#4682B4")
     .on("mouseover", function (event, d) {
        const { clientX, clientY } = event;

        const tooltipContent = `${selectedOption}: ${d[selectedOption]}<br>Date: ${
          d.Pol_Date
        }<br>City: ${city.label}`;

        d3.select(this).attr("r", 8);

        tooltip
         .style("display", "block")
         .html(tooltipContent)
         .style("left", clientX + 10 + "px")
         .style("top", clientY + -100  + "px");
      })
     .on("mouseout", function () {
        d3.select(this).attr("r", 5);

        tooltip.style("display", "none");
      });

    // Legend or text for cityrepresentation
    const legend = svg
    .append("g")
    .attr("transform", `translate(${width - 100}, ${margin.top})`);

    legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#FF69B4"); // Pink

    legend
    .append("text")
    .attr("x", 15)
    .attr("y", 10)
    .text(city? city.label : "City")
    .attr("alignment-baseline", "middle");

    legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 20)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "#4682B4"); // Blue

    legend
    .append("text")
    .attr("x", 15)
    .attr("y", 30)
    .text(compareCity? compareCity.label : "Compare City")
    .attr("alignment-baseline", "middle");
  }, [rawdata, compareRawdata, selectedOption, city, compareCity]);

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleCompareCityChange = (selectedOption) => {
    setCompareCity(selectedOption);
  };

  const handleCityChange = (selectedOption) => {
    setCity(selectedOption);
  };

  const handleTimeRangeChange = (event) => {
    setSelectedTimeRange(event.target.value);
  };

  return (
    <div className="mx-4 my-4 flex flex-col">
    <div className="flex flex-col lg:flex-row lg:justify-between">
        <div >
            <h1 className="text-2xl text-[#33a0d3]">Historic Air Quality Data</h1>
            <div className="mt-2 text-xs text-slate-500">
                <span>Explore insightful air pollution data for:</span>
                <ul className="list-disc mt-1 ml-4">
                    <li>Last 24 hours</li>
                    <li>Last 7 days</li>
                    <li>Last 1 month</li>
                </ul>
            </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 mt-2 lg:mt-0">
            <div className="best bg-green-500 text-white rounded-lg p-1 flex justify-center items-center">
                <span className="text-xs text-center">Best<br />{selectedOption}</span>
                <h3 className="text-sm">{bestValue}</h3>
            </div>
            <div className="worst bg-red-500 text-white rounded-lg p-1 mt-2 lg:mt-0 flex justify-center items-center">
                <span className="text-xs text-center">Worst<br />{selectedOption}</span>
                <h3 className="text-sm">{worstValue}</h3>
            </div>
        </div>
    </div>


      <div >
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
            className="border  border-gray-300 p-2 rounded-md mt-3 ml-3"
            options={cityOptions}
            value={city}
            onChange={handleCityChange}
            isClearable
          />

          <Select
            className="border border-gray-300 p-2 rounded-md mt-3 ml-3"
            options={compareCityOptions}
            value={compareCity}
            onChange={handleCompareCityChange}
            isClearable
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