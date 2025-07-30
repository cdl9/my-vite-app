import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';




function Forecast({ forecast, unit }) {
  
  const todayForecast = forecast.list
    .filter(item => isToday(parseISO(item.dt_txt))) // only today's entries
    .slice(0, 6); // limit to first 6 hours (~18 hours ahead)

    
  if (!forecast) return null;
  return (
    <div>
      <div className="hourly-forecast">
          <h3>Hourly Forecast</h3>
          <div className="hourly-items">
            {todayForecast.map(item => (
              <div key={item.dt} className="hourly-item">
                <p>{format(parseISO(item.dt_txt), 'h a')}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                />
                <p>{Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
              </div>
            ))}
          </div>
      </div>
      <h3>5 Days Forecast</h3>

      <div className="forecast">
        {forecast.list
          .filter((_, i) => i % 8 === 0) // Approx. one per day
          .map(item => (
            
            
              <div key={item.dt} className="forecast-item">
                  <p className="date-forecast"> {format(new Date(item.dt_txt), 'EEE, MMMM do')}</p>
                  <p>{item.weather[0].main}</p>
                  <img
                      src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt="Weather icon"
                  />
                  <p><FontAwesomeIcon icon="temperature-half" /> Temp: {Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
                  <p><FontAwesomeIcon icon="droplet" /> Humidity: {item.main.humidity}%</p>
                  <p><FontAwesomeIcon icon="wind" /> Wind: {item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</p>

              </div>
          ))}
      </div>
    </div>
  );
}

export default Forecast;
