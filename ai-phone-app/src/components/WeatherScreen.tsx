import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WeatherScreenProps {
  onClose: () => void;
}

interface WeatherDay {
  day: string;
  icon: string;
  high: number;
  low: number;
}

export const WeatherScreen: React.FC<WeatherScreenProps> = ({ onClose }) => {
  const [weatherData, setWeatherData] = useState({
    location: '北京市',
    temperature: 26,
    condition: '晴朗',
    humidity: 45,
    wind: '东北风 3级',
    uvIndex: 6,
    feelsLike: 28,
  });

  const forecast: WeatherDay[] = [
    { day: '今天', icon: '☀️', high: 28, low: 18 },
    { day: '明天', icon: '⛅', high: 26, low: 17 },
    { day: '周三', icon: '🌧️', high: 22, low: 15 },
    { day: '周四', icon: '🌤️', high: 24, low: 16 },
    { day: '周五', icon: '☀️', high: 27, low: 18 },
    { day: '周六', icon: '⛅', high: 25, low: 17 },
    { day: '周日', icon: '🌧️', high: 23, low: 15 },
  ];

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = 'YOUR_API_KEY';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Beijing,cn&appid=${apiKey}&units=metric&lang=zh_cn`
        );
        if (response.ok) {
          const data = await response.json();
          setWeatherData({
            location: data.name,
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].description,
            humidity: data.main.humidity,
            wind: `${data.wind.speed} m/s`,
            uvIndex: 5,
            feelsLike: Math.round(data.main.feels_like),
          });
        }
      } catch (e) {
        console.log('Using mock weather data');
      }
    };
    fetchWeather();
  }, []);

  return (
    <div className="weather-screen">
      <div className="weather-header">
        <button className="weather-back-btn" onClick={onClose}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5m0 0l7-7 7 7" />
          </svg>
        </button>
        <h2 className="weather-title">天气</h2>
        <button className="refresh-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 16 23 22" />
            <polyline points="1 20 1 14 7 8 1 2" />
          </svg>
        </button>
      </div>

      <motion.div
        className="current-weather"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="location">{weatherData.location}</div>
        <div className="current-icon">☀️</div>
        <div className="current-temp">{weatherData.temperature}°</div>
        <div className="current-condition">{weatherData.condition}</div>
      </motion.div>

      <motion.div
        className="weather-details"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="detail-item">
          <span className="detail-icon">💧</span>
          <span className="detail-label">湿度</span>
          <span className="detail-value">{weatherData.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <span className="detail-label">风向</span>
          <span className="detail-value">{weatherData.wind}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🧴</span>
          <span className="detail-label">紫外线</span>
          <span className="detail-value">{weatherData.uvIndex}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">🌡️</span>
          <span className="detail-label">体感温度</span>
          <span className="detail-value">{weatherData.feelsLike}°</span>
        </div>
      </motion.div>

      <motion.div
        className="hourly-forecast"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="section-title">24小时预报</h3>
        <div className="hourly-scroll">
          {Array.from({ length: 24 }, (_, i) => {
            const hour = (new Date().getHours() + i) % 24;
            return {
              hour: `${hour}:00`,
              temp: Math.round(18 + Math.sin((i / 24) * Math.PI) * 10),
              icon: i >= 6 && i <= 18 ? '☀️' : '🌙',
            };
          }).map((item) => (
            <div key={item.hour} className="hourly-item">
              <span className="hour-time">{item.hour}</span>
              <span className="hour-icon">{item.icon}</span>
              <span className="hour-temp">{item.temp}°</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="daily-forecast"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="section-title">7日预报</h3>
        <div className="daily-list">
          {forecast.map((day, index) => (
            <motion.div
              key={day.day}
              className="daily-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <span className="day-name">{day.day}</span>
              <span className="day-icon">{day.icon}</span>
              <div className="day-temps">
                <span className="temp-high">{day.high}°</span>
                <span className="temp-low">{day.low}°</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};