function Forecast({ forecast, unit }) {
  if (!forecast || !forecast.daily) return null;

  return (
    <div className="forecast">
      {forecast.daily.slice(1, 6).map((day, index) => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
        return (
          <div key={index} className="forecast-day">
            <p>{dayName}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
              alt={day.weather[0].description}
            />
            <p>🌡️ {Math.round(day.temp.day)}°{unit === 'metric' ? 'C' : 'F'}</p>
            <p>💧 {day.humidity}%</p>
          </div>
        );
      })}
    </div>
  );
}

export default Forecast;
