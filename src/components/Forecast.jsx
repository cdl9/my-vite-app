import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {format, parse} from 'date-fns';


function Forecast({ forecast, unit }) {


    
  if (!forecast) return null;
  return (
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
  );
}

export default Forecast;
