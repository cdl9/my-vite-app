import React, { use, useState } from 'react';
import WeatherCard from './WeatherCard';
import useForecast from '../hooks/useForecast';

import { useEffect } from 'react';

const API_KEY = '5739b15cf015b1daa9e4085470048ca8';
const DEFAULT_CITY = 'New York';

function GeoLocator({ unit }) {
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { getWeatherByLocation(); }, []);
  useEffect(() => {
  if (location) {
    fetchWeather(location.latitude, location.longitude);
  }
  }, [unit, location]);

  function getWeatherByLocation() {
    
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(success, error);

      
    } else {
      console.log("Geolocation not supported");
      fallbackToDefaultCity();
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setLocation({ latitude, longitude });
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  };

  const fetchWeather = (lat,lon)  => {
    setLoading(true);
    // Make API call to OpenWeatherMap
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${unit}`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
        console.log(data);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      }
    );
  }

  function error() {
    console.log("Unable to retrieve your location");
  }
  function fallbackToDefaultCity() {
    console.log("Falling back to default city:", DEFAULT_CITY);
    setLoading(true);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${DEFAULT_CITY}&appid=${API_KEY}&units=${unit}`)
      .then(response => response.json())
      .then(data => {
        setWeather(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }

  return (
    <div>
      {location && !weather ? <p>Loading weather data...</p> : null}
      {weather ? (
        <WeatherCard weather={weather} unit={unit} />
      ) : null}
      
    </div>
  );
}

export default GeoLocator;