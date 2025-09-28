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
import WeatherMap from './components/WeatherMap';
import SkeletonCard from './components/SkeletonCard';
import SavedCities from './components/SavedCities';
import Spinner from './components/spinner';
import FadeInSection from './components/FadeInSection';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { set } from 'date-fns';

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
  const [cityLabel, setCityLabel] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState('metric'); // 'metric' = Celsius, 'imperial' = Fahrenheit
  const [visibility, setVisibility] = useState('hidden');

  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [backgroundClass, setBackgroundClass] =useState('bg-default');

  const [triggerStat, setTriggerStat] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }

  const [savedCities, setSavedCities] = useState(() => {
    // load from localStorage on init
    const stored = localStorage.getItem("savedCities");
    return stored ? JSON.parse(stored) : [];
  });
  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  }

  useEffect(() => {
  if (weather) {

    fetchWeather({
      lat: weather.coord?.lat,
      lon: weather.coord?.lon
    });
  }
  }, [unit]);
  
  useEffect(() => {
  // try geolocation on mount
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude });
    },
    () => {
      // fallback to default city if geolocation blocked
      fetchWeather({ city: "New York" });
    }
  );
}, []);

  const fetchWeather = async (coords) => {
    if (!city && !coords) {
      setWeather(null);
      setForecast(null);
      return;
    }

    setLoading(true);
    console.log("loading", loading);
    try {
      
      const weatherData = await fetchWeatherService({
        city: coords ? null : city,
        lat: coords?.lat,
        lon: coords?.lon,
        unit,
        apiKey: API_KEY
      });

      setWeather(weatherData);
      if(!weather&&!city)
        setCityLabel(`${weatherData.name}, ${weatherData.sys.country}`)

      const forecastData = await fetchForecastByCoords(
        coords?.lat || weatherData.coord?.lat,
        coords?.lon || weatherData.coord?.lon,
        unit, API_KEY,

      );

      setForecast(forecastData); // ✅ This sets the forecast state

      const weatherType = weatherData?.weather?.[0]?.main;
      const backgroundClass = weatherBackgrounds[weatherType] || 'bg-default';
      setBackgroundClass(backgroundClass); // 👈 use a new state for this
      //setWeather(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    }
    finally{
    setTimeout(() => setLoading(false), 300); // 300ms minimum spinner time
    setVisibility('visible');
    
    }
  };

  

  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') fetchWeather();
  };

//${backgroundClass}
  return (
    

    
    <div className={`app-container ${backgroundClass}`}> 
      
    <div className={`app ${darkMode ? 'dark' : 'light'} `}>
      {loading ? (
        <div className="loading-screen">
          <Spinner />
        </div>
      ) : (
        <>
        <div className='background-card'  style={{display:'flex', flexDirection:'row', alignContent:'center', alignItems:'center', justifyContent:'space-between'}} >
          <h2 style={{padding:'0px 20px'}}>WeatherApp</h2>
          <SearchBar
              city={city}
              setCity={setCity}
              onSearch={fetchWeather}
              onEnter={handleKeyPress}
              setCityLabel={setCityLabel}
              API_KEY={API_KEY}
              darkMode={darkMode}
          />
          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode}/>
          <UnitToggle unit={unit} setUnit={setUnit} />    
        </div>

        <FadeInSection>
        {!weather && <GeoLocator onCoords={fetchWeather} unit={unit}/>}
        </FadeInSection>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <FadeInSection delay={0.2}>
        {weather && (
          <WeatherCard weather={weather} unit={unit} cityLabel={cityLabel} 
            savedCities={savedCities}
            setSavedCities={setSavedCities}
            onStatClick={(metric)=>setTriggerStat(metric)}
            triggerToast={triggerToast}
          />
        )}
        </FadeInSection>

        <FadeInSection delay={0.4}>
        {forecast && (
          <Forecast forecast={forecast} unit={unit} darkMode={darkMode} 
            triggerStat={triggerStat}
            setTriggerStat={setTriggerStat}
            cityLabel={cityLabel}
          />
        )}
        </FadeInSection>

        <FadeInSection delay={0.6}>
        {<SavedCities savedCities={savedCities} setSavedCities={setSavedCities} unit={unit} 
            onSelectCity={(cityObj) =>{
              fetchWeather({ lat: cityObj.lat, lon: cityObj.lon }) ,
              setCityLabel(cityObj.cityLabel)}
            }
            triggerToast={triggerToast}
        />}
        </FadeInSection>    

        {showToast && (
          <div className="toast">
            {toastMessage}
          </div>
        )}
        </>
      )}
    </div>

    </div>
  );
}

export default App;

