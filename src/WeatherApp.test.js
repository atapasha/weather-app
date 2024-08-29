import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import WeatherApp from './WeatherApp';

jest.mock('axios');

describe('WeatherApp Component', () => {
  beforeEach(() => {
    // تمیز کردن localStorage قبل از هر تست
    localStorage.clear();
  });

  it('renders default weather data for Tehran', async () => {
    // شبیه‌سازی پاسخ API برای تهران
    const mockWeatherData = {
      data: {
        name: 'Tehran',
        main: { temp: 25 },
        weather: [{ description: 'Clear sky' }],
        wind: { speed: 3 },
      },
    };

    const mockForecastData = {
      data: {
        list: Array(5).fill({
          dt: Math.floor(Date.now() / 1000),
          main: { temp: 25 },
          weather: [{ description: 'Clear sky' }],
        }),
      },
    };

    axios.get.mockResolvedValueOnce(mockWeatherData);
    axios.get.mockResolvedValueOnce(mockForecastData);

    render(<WeatherApp />);

    expect(screen.getByText('در حال بارگذاری...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('وضعیت آب و هوا در Tehran')).toBeInTheDocument();
      expect(screen.getByText('دمای فعلی: 25°C')).toBeInTheDocument();
      expect(screen.getByText('وضعیت: Clear sky')).toBeInTheDocument();
    });
  });

  it('displays an error message when the API call fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API call failed'));

    render(<WeatherApp />);

    await waitFor(() => {
      expect(screen.getByText('مشکلی در دریافت داده‌های آب و هوا رخ داده است.')).toBeInTheDocument();
    });
  });

  it('fetches weather data for a new city when the input changes', async () => {
    const mockWeatherData = {
      data: {
        name: 'Shiraz',
        main: { temp: 30 },
        weather: [{ description: 'Sunny' }],
        wind: { speed: 2 },
      },
    };

    const mockForecastData = {
      data: {
        list: Array(5).fill({
          dt: Math.floor(Date.now() / 1000),
          main: { temp: 30 },
          weather: [{ description: 'Sunny' }],
        }),
      },
    };

    axios.get.mockResolvedValueOnce(mockWeatherData);
    axios.get.mockResolvedValueOnce(mockForecastData);

    render(<WeatherApp />);

    fireEvent.change(screen.getByPlaceholderText('نام شهر را وارد کنید'), { target: { value: 'Shiraz' } });
    fireEvent.blur(screen.getByPlaceholderText('نام شهر را وارد کنید'));

    await waitFor(() => {
      expect(screen.getByText('وضعیت آب و هوا در Shiraz')).toBeInTheDocument();
      expect(screen.getByText('دمای فعلی: 30°C')).toBeInTheDocument();
      expect(screen.getByText('وضعیت: Sunny')).toBeInTheDocument();
    });
  });

  it('uses cached data from localStorage if available', () => {
    const mockWeatherData = {
      name: 'Tehran',
      main: { temp: 25 },
      weather: [{ description: 'Clear sky' }],
      wind: { speed: 3 },
    };

    const mockForecastData = {
      list: Array(5).fill({
        dt: Math.floor(Date.now() / 1000),
        main: { temp: 25 },
        weather: [{ description: 'Clear sky' }],
      }),
    };

    localStorage.setItem('weatherData', JSON.stringify(mockWeatherData));
    localStorage.setItem('forecastData', JSON.stringify(mockForecastData));
    localStorage.setItem('lastUpdate', new Date().toLocaleString());

    render(<WeatherApp />);

    expect(screen.getByText('وضعیت آب و هوا در Tehran')).toBeInTheDocument();
    expect(screen.getByText('دمای فعلی: 25°C')).toBeInTheDocument();
    expect(screen.getByText('وضعیت: Clear sky')).toBeInTheDocument();
  });
});
