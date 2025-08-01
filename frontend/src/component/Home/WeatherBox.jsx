import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WeatherBox = () => {
  const [weather, setWeather] = useState(null);
  const apiKey = '7f558feb2601573fba750208db98fb2e'; // 실제 API 키 7f558feb2601573fba750208db98fb2e

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Busan&appid=${apiKey}&units=metric&lang=kr`;
        const res = await axios.get(url);
        console.log('날씨 데이터:', res.data);
        setWeather(res.data);
      } catch (error) {
        console.error('날씨 정보 불러오기 실패:', error);
      }
    };

    fetchWeather();
  }, []);

  return (
    <div style={{ padding: '16px' }}>
      <h2>현재 날씨</h2>
      {weather ? (
        <>
          <p>도시: {weather.name}</p>
          <p>온도: {weather.main.temp}°C</p>
          <p>상태: {weather.weather[0].description}</p>
          <p>습도: {weather.main.humidity}%</p>
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="날씨 아이콘"
          />
        </>
      ) : (
        <p>날씨 정보를 불러오는 중입니다...</p>
      )}
    </div>
  );
};

export default WeatherBox;