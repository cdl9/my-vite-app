// src/components/WeatherCard.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faSolidBookmark } from '@fortawesome/free-solid-svg-icons'; // Filled bookmark
import { faBookmark as faRegularBookmark } from '@fortawesome/free-regular-svg-icons';
import ReactAnimatedWeather from 'react-animated-weather';

import iconMap from "./iconMap";
import { useEffect, useState } from 'react';
import { format, set } from 'date-fns';
import WeatherIcon from './WeatherIcon';
import { icon } from 'leaflet';

const defaults = {
  icon: 'CLEAR_DAY',
  color: 'goldenrod',
  size: 40,
  animate: true
};


const WeatherCard = ({ weather, unit, cityLabel, savedCities, setSavedCities, onStatClick, triggerToast }) => {
  const [localTime, setLocalTime] = useState('');
  const [localDate, setLocalDate] = useState('');

  const [fade, setFade] = useState('fade-in'); 
  const [displayTemp, setDisplayTemp] = useState(null);

  if (!weather) return null;
  
  const isSaved = savedCities.some(
    (c) => c.lat === weather.coord.lat && c.lon === weather.coord.lon
  );

  const toggleFavorite = () => {
    if (isSaved) {
      // remove from saved
      setSavedCities(savedCities.filter(c => !(c.lat === weather.coord.lat && c.lon === weather.coord.lon)));
      triggerToast(`${weather.name} removed from favorites`);
    } else {
      // add to saved
      setSavedCities([
        ...savedCities,
        {
          name: weather.name,
          country: weather.sys.country,
          cityLabel,
          temp: weather.main.temp,
          lat: weather.coord.lat,
          lon: weather.coord.lon,
          icon: weather.weather[0].icon,
        },
      ]);
      console.log("icon", weather.weather[0].icon);
       triggerToast(`${weather.name} added to favorites`);
    }
  };

  const updateLocalTime = () => {
      const nowUTC = Math.floor(Date.now() / 1000) + (new Date().getTimezoneOffset() * 60); // current UTC time in seconds
      const localTimestamp = nowUTC + weather.timezone; // add timezone offset
      const localDate = new Date(localTimestamp * 1000);

      setLocalTime(format(localDate, 'h:mm a'));
      setLocalDate(format(localDate, 'EEEE, MMMM do'));
    };

  useEffect(() => {
    updateLocalTime(); // initial calculation

    const timer = setInterval(() => {
      updateLocalTime(); // update every minute
    }, 60000);

    return () => clearInterval(timer); // cleanup on unmount
  }, [weather.timezone]);



  const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  };

  const sunriseTime = formatTime(weather.sys.sunrise);
  const sunsetTime = formatTime(weather.sys.sunset);
  return (
    <div className="weather-card background-card">
      <div className='small-card weather-main-card'>
        <button className='bookmark-button' style={{justifySelf:'flex-end',marginTop:'10px'}}
          onClick={toggleFavorite}
        >
          <FontAwesomeIcon icon={isSaved ? faSolidBookmark : faRegularBookmark} className="mediumIcon"/>
        </button>
        <div className='flex-row' style={{backgroundColor:'transparent'}}>
          <div className="weather-header">
            <h2>{cityLabel}</h2>
            <p>{localDate}</p>
            <p>Local Time: {localTime}</p>
            <div className='animated-icon'>
              <WeatherIcon code={weather.weather[0].icon}  size={60}/>
            </div>
            <p>{weather.weather[0].main} - {weather.weather[0].description}</p>
          </div>

          <div className="temperature-details"> 
            <p className={`temperatureBig temp-value ${fade}`}>{weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
            <p><FontAwesomeIcon icon="temperature-half" /> Feels like {weather.main.feels_like}°{unit === 'metric' ? 'C' : 'F'}</p>
            <div className="feature-details">
              <FontAwesomeIcon icon="sun" className="mediumIcon"/>
              <div className="feature-text">
                <p> Sunrise</p>
                <p>{sunriseTime}</p>
              </div>
          </div>
          <div className="feature-details">
              <FontAwesomeIcon icon="moon" className="mediumIcon"/>
              <div className="feature-text">
                <p> Sunset</p>
                <p>{sunsetTime}</p>
              </div>
          </div>
          
          </div>
        </div>
      </div>
      
      


      <div className="extra-details">
        <div className="feature-text full-width small-card"
          onClick={() => onStatClick('humidity')}
        > 
            <div className='center-parent-flex'>
              <FontAwesomeIcon icon="droplet"/> 
              <p style={{ margin:'0.5rem'}}>Humidity</p>
            </div>
            <p>{weather.main.humidity}%</p>
        </div>
        <div className="feature-text full-width small-card"
          onClick={() => onStatClick('wind')}
        > 
            <div className='center-parent-flex'>
              <FontAwesomeIcon icon="wind"/> 
              <p style={{ margin:'0.5rem'}}>Wind</p>
            </div>
            <p> {weather.wind.speed}{unit === 'metric' ? 'm/s' : 'mph'}</p>
        </div>
        <div className="feature-text full-width small-card"
          onClick={() => onStatClick('rain')}
        >
            <div className='center-parent-flex'>
              <FontAwesomeIcon icon="tachometer-alt"/> 
              <p style={{ margin:'0.5rem'}}>Pressure</p>
            </div>
            <p> {weather.main.pressure}Pa</p>
        </div>

      </div>
    </div>
  );
};

export default WeatherCard;
