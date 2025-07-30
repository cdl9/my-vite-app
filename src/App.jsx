import { useState } from 'react';
import './App.css';
import GeoLocator from './components/GeoLocator';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import { useEffect } from 'react';
import UnitToggle from './components/UnitToggle';
import { fetchWeatherByCity, fetchCoordinatesByCity, fetchForecastByCoords } from './services/weatherService';
import Forecast from './components/Forecast';


import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Add all solid and brand icons to the library
library.add(fas, fab);

const API_KEY = '5739b15cf015b1daa9e4085470048ca8';



function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('metric'); // 'metric' = Celsius, 'imperial' = Fahrenheit

  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  }

  useEffect(() => {
  if (city) {
    fetchWeather();
  }
  }, [unit]);

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const data = await fetchWeatherByCity(city, unit, API_KEY);
      const { lat, lon } = await fetchCoordinatesByCity(city, API_KEY);
      console.log(`Coordinates for ${city}: Lat: ${lat}, Lon: ${lon}`);
      
      const forecastData = await fetchForecastByCoords(lat, lon, unit, API_KEY);
      console.log(`Forecast for ${city}:`, forecastData);
      setForecast(forecastData); // ✅ This sets the forecast state

      setWeather(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
    setLoading(false);
  };

  

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      {/* 🔘 Dark Mode Toggle Button */}
      <button onClick={toggleDarkMode} className="dark-mode-toggle main-button">
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <h1>🌤️ Weather App</h1>
      <UnitToggle unit={unit} setUnit={setUnit} />
      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={fetchWeather}
        onEnter={handleKeyPress}
      />  

      {!weather && <GeoLocator unit={unit}/>}

      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weather && <WeatherCard weather={weather} unit={unit} />}
      {forecast &&<o>5 Days Forecast</o>}
      {forecast && <Forecast forecast={forecast} unit={unit} />}

    </div>

  );
}

export default App;
