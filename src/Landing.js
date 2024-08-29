import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Landing = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Tehran&appid=YOUR_API_KEY&units=metric`);
        setWeatherData(response.data);
        setLastUpdated(new Date().toLocaleString());
      } catch (error) {
        console.error("Error fetching the weather data", error);
      }
    };

    fetchWeather();
  }, []);

  if (!weatherData) return <p>در حال بارگذاری اطلاعات...</p>;

  return (
    <div>
      <h1>وضعیت کلی آب و هوا</h1>
      <p>دمای فعلی در {weatherData.name}: {weatherData.main.temp}°C</p>
      <p>آخرین به‌روزرسانی: {lastUpdated}</p>
    </div>
  );
};

export default Landing;
