import React, { useEffect, useState } from "react";
import { getBaseUrl, getStationName, getTodayDate } from "../Connectivity/storageHelper";

const Component4 = (selectedSearch) => {
  const [aqiData, setAqiData] = useState(null);
  const [next3Dates, setNext3Dates] = useState([]);

  useEffect(() => {
    getPollutionData();
    generateNext3Dates();
  }, [selectedSearch]);

  const generateNext3Dates = () => {
    try {
      const todaydate = getTodayDate();
      if (!todaydate) throw new Error("Today's date is invalid or not provided.");
      
      const dateWithoutTime = todaydate.split(" ")[0]; // Extracts "YYYY-MM-DD"
      const startDate = new Date(dateWithoutTime);

      // Array to store the next 3 dates
      const upcomingDates = [];

      // Loop to generate the next 3 dates
      for (let i = 1; i < 4; i++) {
        const currentDate = new Date(startDate); // Create a new date object each iteration
        currentDate.setDate(startDate.getDate() + i); // Increment the date by i days
        const options = {
          day: 'numeric',
          month: 'short',
        };
        const formattedDate = currentDate.toLocaleString('en-US', options);
        upcomingDates.push(formattedDate);
      }

      setNext3Dates(upcomingDates);
    } catch (error) {
      console.error("Error generating the next 3 dates:", error.message);
    }
  };

  const getPollutionData = async () => {
    try {
      const selectstation = getStationName();
      const baseurl = getBaseUrl();
      const response = await fetch(
        `${baseurl}get-MLData/?pol_Station=${selectstation}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
     
      const data = await response.json();
      setAqiData(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <>
      <div className="m-8">
        {/* HEALTH ADVICE */}
        <div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <h1 className="text-xl text-[#33a0d3]">Health Advice</h1>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 128 128"
                  fill="none"
                >
                  <g clipPath="url(#clip0_710_2)">
                    <path
                      d="M68.9702 31.6601C68.3302 31.1701 67.5902 30.8101 66.7302 30.6101C65.8802 30.4201 64.9802 30.3101 64.0102 30.3101C63.0402 30.3101 62.1302 30.4101 61.2702 30.6101C60.4002 30.8001 59.6602 31.1601 59.0102 31.6601C58.3702 32.1501 57.8702 32.8001 57.5002 33.6101C57.1402 34.4201 56.9502 35.4401 56.9502 36.6501C56.9502 37.8401 57.1402 38.8401 57.5002 39.6701C57.8702 40.4801 58.3702 41.1501 59.0102 41.6401C59.6502 42.1301 60.4002 42.4901 61.2702 42.7001C62.1302 42.9101 63.0402 43.0201 64.0102 43.0201C64.9702 43.0201 65.8802 42.9101 66.7302 42.7001C67.5902 42.4901 68.3302 42.1301 68.9702 41.6401C69.6102 41.1501 70.1202 40.4801 70.5002 39.6701C70.8802 38.8401 71.0702 37.8401 71.0702 36.6501C71.0702 35.4301 70.8802 34.4101 70.5002 33.6101C70.1202 32.8001 69.6102 32.1501 68.9702 31.6601ZM57.5202 48.9401H70.4902V96.4501H57.5202V48.9401Z"
                      fill="#40C0E7"
                    />
                    <path
                      d="M64.0002 0.410034C28.9302 0.410034 0.410156 28.93 0.410156 64C0.410156 99.06 28.9302 127.59 63.9902 127.59C99.0502 127.59 127.58 99.07 127.58 64C127.59 28.93 99.0602 0.410034 64.0002 0.410034ZM64.0002 118.41C34.0002 118.41 9.60016 94 9.60016 64C9.60016 34 34.0002 9.59003 64.0002 9.59003C94.0002 9.59003 118.41 34 118.41 64.01C118.4 94 93.9902 118.41 64.0002 118.41Z"
                      fill="#40C0E7"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_710_2">
                      <rect width="128" height="128" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </span>
            </div>
            <span className="text-sm text-slate-500 my-3 mb-4">
              How to protect yourself from air pollution in India
            </span>
          </div>
          <div className="precautions gap-4 lg:flex lg:flex-row grid grid-cols-3 lg:justify-evenly mt-8">
            <div className="items-center justify-center flex flex-col mask">
              <img
                src="/precautions/wear-mask-icon.webp"
                alt="Wear Mask Icon"
                className="w-20 lg:w-28"
              />
              <span className="text-gray-600 lg:text-lg text-base font-semibold">
                Wear mask
              </span>
              <span className="text-gray-600 lg:text-sm text-xs">Required</span>
            </div>
            <div className="items-center justify-center flex flex-col stay-indoors">
              <img
                src="/precautions/Stay-Indoors-icon.webp"
                alt=""
                className="w-20 lg:w-28"
              />
              <span className="text-gray-600 lg:text-lg text-base font-semibold">
                Stay Indoor
              </span>
              <span className="text-gray-600 lg:text-sm text-xs">Required</span>
            </div>
            <div className="items-center justify-center flex flex-col windows">
              <img
                src="/precautions/Shut-Openings-icon-cross.webp"
                alt=""
                className="w-20 lg:w-28"
              />
              <span className="text-gray-600 lg:text-lg text-base font-semibold">
                Windows
              </span>
              <span className="text-gray-600 lg:text-sm text-xs">
                Keep Close
              </span>
            </div>
            <div className="items-center justify-center flex flex-col use-purifier">
              <img
                src="/precautions/Use-a-purifier-icon.webp"
                alt=""
                className="w-20 lg:w-28 lg:ml-0 ml-20"
              />
              <span className="text-gray-600 lg:text-lg text-base font-semibold lg:ml-0 ml-20 whitespace-nowrap">
                Use Purifier
              </span>
              <span className="text-gray-600 lg:text-sm text-xs lg:ml-0 ml-20">
                Required
              </span>
            </div>
            <div className="items-center justify-center flex flex-col family col-start-3 ">
              <img
                src="/precautions/family-icon-cross.webp"
                alt=""
                className="w-20 lg:w-28 lg:mr-0 mr-20"
              />
              <span className="text-gray-600 lg:text-lg text-base font-semibold lg:mr-0 mr-20">
                Family
              </span>
              <span className="text-gray-600 lg:text-sm text-xs lg:mr-0 mr-20 whitespace-nowrap">
                Allow Outdoor
              </span>
            </div>
          </div>
        </div>

        {/* AIR QUALITY FORECAST */}
        <div>
          <div className="bg-[#33a0d3] text-white mt-20 h-9 flex justify-center items-center rounded-2xl">
            <p>Air Quality Forecast</p>
          </div>
          <div className="lg:flex lg:flex-row grid grid-cols-3 justify-evenly items-center">
            {/* Mapping over next3Dates array to display each date */}
            {next3Dates.map((date, index) => (
              <div
                key={index}
                className={`mt-3 ${index >= 3 ? "ml-20" : "ml-0"} lg:ml-0 lg:text-lg text-xsm justify-evenly`}
              >
                {aqiData &&
                  aqiData.map((day, dataIndex) => (
                    <div
                      key={dataIndex}
                      className="whitespace-nowrap flex flex-col justify-center items-center gap-3"
                    >
                      <span>{date}</span>
                      <div className="green bg-[#ecffeb] flex flex-col rounded-xl lg:px-8 px-2 py-3 items-center justify-center gap-2">
                        <h1 className="lg:text-xl text-base text-[#5e5e5e] font-bold">
                          {day[`Day${index + 1}`]}
                        </h1>
                        <span className="lg:text-sm text-xs text-slate-500">
                          AQI
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Component4;