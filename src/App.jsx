import { useState } from 'react';
import './App.css';
import GeoLocator from './components/GeoLocator';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import { useEffect } from 'react';
import UnitToggle from './components/UnitToggle';
import { fetchWeatherByCity } from './services/weatherService';

const API_KEY = '5739b15cf015b1daa9e4085470048ca8';



function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState('metric'); // 'metric' = Celsius, 'imperial' = Fahrenheit
  const [forecast, setForecast] = useState(null);

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
      setWeather(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
    setLoading(false);
  };

  

  /*
  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );
      const data = await res.json();
      console.log('API response:', data); // 🔍 LOG THE RESPONSE

      if (res.ok) {
        setWeather(data);
        setError('');
      } else {
        setWeather(null);
        setError(data.message);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch weather');
      setWeather(null);
    }
    setLoading(false);
  };
*/
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

  return (
    <div className="app">
      <h1>🌤️ Weather App</h1>
      <UnitToggle unit={unit} setUnit={setUnit} />

      <GeoLocator unit={unit}/>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={fetchWeather}
        onEnter={handleKeyPress}
      />  

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weather && <WeatherCard weather={weather} unit={unit} />}

    </div>

  );
}

export default App;
