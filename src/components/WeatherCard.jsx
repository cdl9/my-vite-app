// src/components/WeatherCard.jsx

const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  return (
    <div className="weather-card">
      <h2>{weather.name}, {weather.sys.country}</h2>
      <p>{weather.weather[0].main} - {weather.weather[0].description}</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt="Weather icon"
      />
      <p>🌡️ Temp: {weather.main.temp}°{unit === 'metric' ? 'C' : 'F'}</p>
      <p>💧 Humidity: {weather.main.humidity}%</p>
      <p>💨 Wind: {weather.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>
    </div>
  );
};

export default WeatherCard;
