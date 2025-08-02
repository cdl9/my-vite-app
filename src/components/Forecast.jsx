import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';




function Forecast({ forecast, unit }) {
  if (!forecast || !forecast.list) return null;

  const todayStr = new Date().toISOString().split('T')[0];
const firstDate = forecast.list[0].dt_txt.split(' ')[0];

const hourlyForecast = forecast.list
  .slice(0, 6);

  return (
    <div>
      <div className="hourly-forecast">
          <h3>Hourly Forecast</h3>
          <div className="hourly-items">
            {hourlyForecast.map(item => (
              <div key={item.dt} className="hourly-item">
                <p>{format(parseISO(item.dt_txt), 'h a')}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                  alt="Weather icon"
                  className='hourly-weather-icon'

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
                  <p><FontAwesomeIcon icon="wind" /> Wind: <span className="numberValue">{item.wind.speed} {unit === 'metric' ? 'm/s' : 'mph'}</span></p>

              </div>
          ))}
      </div>
    </div>
  );
}

export default Forecast;
