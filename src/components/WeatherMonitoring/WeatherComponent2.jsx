import React, { useEffect, useState } from "react";

const WeatherComponent2 = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [location, setLocation] = useState(null);
  const api_key = "e3b177641df6073f97de399d1ee1cb35";

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    fetchData();
  }, []);

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}`
      );
      const data = await response.json();
      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const convertToFahrenheit = (temp) => {
    return (temp - 273.15).toFixed(2);
  };

  if (!weatherData) {
    return (
      <div className="bento-card p-8 flex items-center justify-center w-full">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-metal">Loading forecast...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bento-card p-8 w-full">
        <h3 className="text-lg font-semibold text-ink mb-6">Weather Forecast</h3>
        <div className="grid grid-cols-4 gap-4">
          {weatherData.list.slice(0, 4).map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex flex-col justify-center items-center gap-2 mb-4">
                {day && (
                  <img
                    src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                    alt=""
                    className="w-12 h-12"
                  />
                )}
                <span className="text-xl font-semibold text-ink">{convertToFahrenheit(day && day.main.temp)}°C</span>
                <span className="text-sm text-metal capitalize">{day && day.weather[0].description}</span>
              </div>
              <div className="flex flex-col bg-primary/10 p-3 rounded-card w-full text-sm">
                <span className="text-ink">
                  <span className="text-metal">Feels like:</span>{" "}
                  <span className="font-medium">{convertToFahrenheit(day && day.main.feels_like)}°C</span>
                </span>
                <span className="text-ink">
                  <span className="text-metal">Pressure:</span>{" "}
                  <span className="font-medium">{day && day.main.pressure}</span>
                </span>
                <span className="text-ink">
                  <span className="text-metal">Humidity:</span>{" "}
                  <span className="font-medium">{day && day.main.humidity}%</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeatherComponent2;
