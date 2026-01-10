import React, { useState, useEffect } from "react";

const WeatherComponent1 = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const api_key = "e3b177641df6073f97de399d1ee1cb35";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}`
      );
      const data = await response.json();
      // console.log(data);
      setWeatherData(data);
    } catch (error) {
      // console.log("Error:", error);
    }
  };

  const convertToFahrenheit = (temp) => {
    return ((temp - 273.15) * 9) / 5 + 32;
  };

  const convertToCelsius = (temp) => {
    return temp - 273.15;
  };

  if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
    return (
      <div className="bento-card p-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-metal">Loading weather data...</span>
        </div>
      </div>
    );
  }

  const weatherItem = weatherData.list[0];
  const iconUrl = `https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}.png`;
  const tempCelsius = convertToCelsius(weatherItem.main.temp);

  return (
    <>
      <div className="bento-card p-8 flex flex-col w-full h-full justify-between">
        <div className="flex flex-col justify-center items-center gap-3">
          <img
            src={iconUrl}
            alt={weatherItem.weather.main}
            className="w-20 h-20"
          />
          <span className="text-5xl font-bold text-ink">{tempCelsius.toFixed(2)}°C</span>
          <span className="text-metal text-lg">
            {weatherData.city.name}, {weatherData.city.country}
          </span>
        </div>
        <div className="mt-6 pt-6 border-t border-mist">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-2 items-center">
              <span className="text-2xl font-semibold text-ink">
                {convertToCelsius(weatherItem.main.temp_min).toFixed(2)}°C
              </span>
              <span className="text-sm text-metal">Min Temp</span>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <span className="text-2xl font-semibold text-ink">
                {convertToCelsius(weatherItem.main.temp_max).toFixed(2)}°C
              </span>
              <span className="text-sm text-metal">Max Temp</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherComponent1;
