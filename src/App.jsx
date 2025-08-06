import { useState } from 'react';
import './App.css';
import GeoLocator from './components/GeoLocator';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import { useEffect } from 'react';
import UnitToggle from './components/UnitToggle';
import DarkModeToggle from './components/DarkModeToggle';
import { fetchWeather as fetchWeatherService, fetchForecastByCoords } from './services/weatherService';
import Forecast from './components/Forecast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

const weatherBackgrounds = {
  Clear: 'bg-clear',
  Rain: 'bg-rain',
  Clouds: 'bg-clouds',
  Snow: 'bg-snow',
  Thunderstorm: 'bg-thunderstorm',
  Drizzle: 'bg-drizzle',
  Mist: 'bg-mist',
  Haze: 'bg-haze',
  Smoke: 'bg-smoke',
  Fog: 'bg-fog',
  Dust: 'bg-dust',
  Sand: 'bg-sand',
  Ash: 'bg-ash',
  Squall: 'bg-squall',
  Tornado: 'bg-tornado'
}



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
  const [backgroundClass, setBackgroundClass] =useState('bg-default');

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  }

  useEffect(() => {
  if (city) {
    fetchWeather();
  }
  }, [unit]);

  const fetchWeather = async (coords) => {
    if (!city && !coords) return;
    setLoading(true);
    try {
      
      const weatherData = await fetchWeatherService({
        city: coords ? null : city,
        lat: coords?.lat,
        lon: coords?.lon,
        unit,
        apiKey: API_KEY
      });
      console.log("coords:", coords);
      console.log("Weather data:", weatherData);
      setWeather(weatherData);
      
      const forecastData = await fetchForecastByCoords(
        coords?.lat || weatherData.coord?.lat,
        coords?.lon || weatherData.coord?.lon,
        unit, API_KEY
      );
      console.log(`Forecast data:`, forecastData);
      setForecast(forecastData); // ✅ This sets the forecast state

      const weatherType = weatherData?.weather?.[0]?.main;
      console.log(weatherType);

      const backgroundClass = weatherBackgrounds[weatherType] || 'bg-default';
      setBackgroundClass(backgroundClass); // 👈 use a new state for this
      console.log(backgroundClass);

      //setWeather(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    }
    setLoading(false);
  };

  

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className={`app-container ${backgroundClass}`}>
    <div className={`app ${darkMode ? 'dark' : 'light'} `}>

      <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode}/>
      <UnitToggle unit={unit} setUnit={setUnit} />
      <div className='header-container'>
        <h1>🌤️ Weather App</h1>
        <SearchBar
          city={city}
          setCity={setCity}
          onSearch={fetchWeather}
          onEnter={handleKeyPress}
          API_KEY={API_KEY}
        />  
      </div>
      {!weather && <GeoLocator unit={unit}/>}

      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weather && <WeatherCard weather={weather} unit={unit} />}
      {forecast && <Forecast forecast={forecast} unit={unit} />}

    </div>
    </div>
  );
}

export default App;
