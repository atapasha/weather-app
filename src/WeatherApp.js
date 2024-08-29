import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(localStorage.getItem('lastUpdate') || '');
  const [location, setLocation] = useState('Tehran'); // مکان پیش‌فرض









  useEffect(() => {
    // بارگذاری داده‌ها از localStorage هنگام راه‌اندازی برنامه
    const storedWeatherData = localStorage.getItem('weatherData');
    const storedForecastData = localStorage.getItem('forecastData');

    if (storedWeatherData && storedForecastData) {
      setWeatherData(JSON.parse(storedWeatherData));
      setForecastData(JSON.parse(storedForecastData));
      setError(null);
    } else {
      // اگر داده‌ها در localStorage موجود نیستند، داده‌های جدید را بارگذاری کنید
      fetchWeather(location);
    }
  }, []);

const fetchWeather = async (place) => {
  try {
    // درخواست به API برای دریافت وضعیت آب و هوا بر اساس نام شهر
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=7e4f70371e8efcb0cc2f00cf7ce2e054&units=metric`
    );

    // درخواست به API برای دریافت پیش‌بینی آب و هوا
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=7e4f70371e8efcb0cc2f00cf7ce2e054&units=metric`
    );

    setWeatherData(response.data);
    setForecastData(forecastResponse.data);
    setLastUpdate(new Date().toLocaleString());
    
    // ذخیره‌سازی داده‌ها در localStorage
    localStorage.setItem('weatherData', JSON.stringify(response.data));
    localStorage.setItem('forecastData', JSON.stringify(forecastResponse.data));
    localStorage.setItem('lastUpdate', new Date().toLocaleString());

    setError(null); // در صورت موفقیت‌آمیز بودن، خطا را پاک کنید
  } catch (error) {
    console.error('Error fetching the weather data', error);
    setError('مشکلی در دریافت داده‌های آب و هوا رخ داده است.'); // پیام خطا
    setWeatherData(null); // اطمینان از خالی بودن داده‌های آب و هوا در صورت بروز خطا
    setForecastData(null); // اطمینان از خالی بودن پیش‌بینی‌ها
  }
};


  const handleLocationChange = (event) => {
    setLocation(event.target.value); // به‌روزرسانی مکان
  };

  const handleBlur = () => {
    if (location.trim()) {
      fetchWeather(location); // بارگذاری اطلاعات آب و هوا بر اساس مکان وارد شده
    } else {
      setError('لطفاً یک نام شهر معتبر وارد کنید.'); // بررسی نام شهر خالی
    }
  };

  return (
    <div className="max-w-md p-4 mx-auto bg-white rounded-md shadow-md">
      <div className="mt-4">
        <input
          type="text"
          value={location}
          onChange={handleLocationChange} // هنوز از onChange استفاده می‌کنیم تا مقدار ورودی را تغییر دهیم
          onBlur={handleBlur} // بارگذاری داده‌ها زمانی که ورودی از حالت انتخاب خارج می‌شود
          placeholder="نام شهر را وارد کنید"
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>} {/* نمایش خطا */}

      {!weatherData && !forecastData && !error && <p>در حال بارگذاری...</p>} {/* پیام بارگذاری */}

      {weatherData && (
        <>
          <h1 className="mb-4 text-2xl font-bold">وضعیت آب و هوا در {weatherData.name}</h1>
          <p>دمای فعلی: {weatherData.main.temp}°C</p>
          <p>وضعیت: {weatherData.weather[0].description}</p>
          <p>سرعت باد: {weatherData.wind.speed} متر بر ثانیه</p>
          <p>آخرین به‌روزرسانی: {lastUpdate}</p>

          <h2 className="mt-6 mb-2 text-xl font-bold">پیش‌بینی ۵ روزه</h2>
          <div className="space-y-2">
            {forecastData.list.slice(0, 5).map((forecast, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded-md">
                <p>تاریخ: {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                <p>دمای پیش‌بینی: {forecast.main.temp}°C</p>
                <p>وضعیت: {forecast.weather[0].description}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherApp;
