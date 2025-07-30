// src/components/WeatherCard.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const WeatherCard = ({ weather, unit }) => {
  
  if (!weather) return null;


  const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  };

  const sunriseTime = formatTime(weather.sys.sunrise);
  const sunsetTime = formatTime(weather.sys.sunset);
  return (
    <div className="weather-card">
      <div className="weather-header">
        <h2>{weather.name}, {weather.sys.country}</h2>
        <img
          src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt="Weather icon"
          className='weather-icon'
        />
        <p>{weather.weather[0].main} - {weather.weather[0].description}</p>
      </div>

      <div className="temperature-details"> 
        <p className="temperatureBig">{weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
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
      
      


      <div className="extra-details">
        <p><FontAwesomeIcon icon="droplet" /> Humidity: {weather.main.humidity}%</p>
        <p><FontAwesomeIcon icon="wind" /> Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
        <p><FontAwesomeIcon icon="tachometer-alt" /> Pressure: {weather.main.pressure}Pa</p>
      </div>
    </div>
  );
};

export default WeatherCard;
