import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format, isToday, parse, parseISO } from 'date-fns';
import ReactAnimatedWeather from 'react-animated-weather';
import WeatherIcon from './WeatherIcon';


function ForecastHour({ item, unit, onClick}) {
  if (!item) return null;
  return (
              <div key={item.dt} className="hourly-item" onClick={onClick}>
                <p>{item.localHour}</p>
                <div className='animated-icon'>
                  <WeatherIcon code={item.weather[0].icon} size={50} />
                </div>
                <p>{Math.round(item.main.temp)}°{unit === 'metric' ? 'C' : 'F'}</p>
              </div>
  );
}

export default ForecastHour;
