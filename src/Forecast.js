import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Forecast = ({ location }) => {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=7e4f70371e8efcb0cc2f00cf7ce2e054&units`);
        setForecastData(response.data);
      } catch (error) {
        console.error("Error fetching the forecast data", error);
      }
    };

    fetchForecast();
  }, [location]);

  if (!forecastData) return <p>در حال بارگذاری پیش‌بینی...</p>;

  return (
    <div>
      <h2>پیش‌بینی چند روز آینده</h2>
      {forecastData.list.slice(0, 5).map((forecast, index) => (
        <div key={index}>
          <p>{forecast.dt_txt}</p>
          <p>دمای: {forecast.main.temp}°C</p>
          <p>وضعیت: {forecast.weather[0].description}</p>
        </div>
      ))}
    </div>
  );
};

export default Forecast;
